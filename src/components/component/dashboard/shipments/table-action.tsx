'use client'

import * as React from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import type { Package, Packages } from '@/types/dashboard'
import { changeShipmentData } from '@/lib/form_action'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  changePackageDataById,
  DeletePackageById,
  package_status_fetcher,
  RegisterPackageById,
} from '@/lib/package_actions'
import { GetCurrentEmployee } from '@/lib/employee_actions'
import useSWR from 'swr'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
  status: z.string(),
  address: z.string(),
  toAdress: z.boolean(),
})

function usePackageStatus() {
  const { data } = useSWR('http://localhost:7028/package/status', package_status_fetcher, {
    refreshInterval: 60000,
  })
  return {
    statuses: data,
  }
}

export function ShipmentTableActions({ package_ }: { package_: Package }) {
  async function handleSubmit(data: z.infer<typeof formSchema>, id: string) {
    let formData = new FormData()
    formData.append('status', data.status)
    formData.append('address', data.address)
    formData.append('toAdress', String(data.toAdress))
    await changePackageDataById(formData, id)
  }
  async function onSubmit(data: z.infer<typeof formSchema>) {
    await handleSubmit(data, package_.id!)
  }

  async function handleRegister() {
    const result = await RegisterPackageById(package_.id!)
    if (result?.success) {
      toast({
        description: 'Package registered successfully.',
      })
    } else {
      toast({
        description: result?.error || 'Failed to register package.',
        variant: 'destructive',
      })
    }
    setShowRegisterDialog(false)
  }

  const { statuses } = usePackageStatus()
  const [showEditDialog, setEditDialog] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [showRegisterDialog, setShowRegisterDialog] = React.useState(false)
  const [currentEmployee, setCurrentEmployee] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  // Check if user can register packages (ParcelManager position or admin/manager roles)
  const canRegister = React.useMemo(() => {
    console.log('Checking if user can register packages...')
    if (!currentEmployee) return false

    // Check if user has admin or manager roles
    const userRoles = currentEmployee.roles || []
    console.log('Current employee roles:', userRoles)
    if (userRoles.includes('admin') || userRoles.includes('manager')) {
      return true
    }

    // Check if user has ParcelManager position
    const positionType = currentEmployee.position?.toLowerCase()
    console.log('Current employee position type:', positionType)
    return positionType === 'parcelmanager'
  }, [currentEmployee])

  // Check if package can be registered (status is "on hold")
  const packageCanBeRegistered = React.useMemo(() => {
    return package_.status?.toLowerCase() === 'on hold'
  }, [package_.status])

  // Fetch current employee info on component mount
  React.useEffect(() => {
    console.log('Fetching current employee...')
    async function fetchCurrentEmployee() {
      try {
        setLoading(true)
        const employee = await GetCurrentEmployee()
        console.log('Current employee fetched:', employee)
        setCurrentEmployee(employee)
      } catch (error) {
        console.error('Failed to fetch current employee:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentEmployee()
  }, [])

  console.log('canRegister:', canRegister)
  console.log('packageCanBeRegistered:', packageCanBeRegistered)
  console.log('Current employee:', currentEmployee)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: package_.status ?? '',
      toAdress: package_.toAdress ?? false,
      address: package_.deliveryAddress ?? '',
    },
  })
  const formButtonRef = React.useRef<HTMLButtonElement>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(package_.trackingNumber ?? '')
            }}
          >
            Copy shipment ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setEditDialog(true)}>Edit</DropdownMenuItem>
          {canRegister && packageCanBeRegistered && (
            <DropdownMenuItem
              onSelect={() => setShowRegisterDialog(true)}
              className="text-green-600"
            >
              Register Package
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)} className="text-red-600">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showEditDialog} onOpenChange={setEditDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Package</AlertDialogTitle>
          </AlertDialogHeader>
          <>
            <Form {...form}>
              <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adress</FormLabel>
                      <FormControl>
                        <Input placeholder="adress" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="toAdress"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Delivery to Custom Address</FormLabel>
                        <FormDescription>
                          Set it if you want to deliver it to your address
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a valid status to add" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statuses?.map(status => (
                            <SelectItem key={status.id} value={status.status!}>
                              {status.status!}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="hidden"
                  variant={'ghost'}
                  ref={formButtonRef}
                  type="submit"
                ></Button>
              </form>
            </Form>
          </>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="outline"
              onClick={() => {
                formButtonRef.current?.click()
                setEditDialog(false)
                toast({
                  description: 'This preset has been edited.',
                })
              }}
            >
              Submit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This preset will no longer be accessible by you or
              others you&apos;ve shared it with.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={async () => {
                await DeletePackageById(package_.id!)
                toast({
                  description: 'This preset has been deleted.',
                })
                setShowDeleteDialog(false)
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Register Package</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to register this package? This will make it available for
              courier assignment and delivery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="default" onClick={handleRegister}>
              Register Package
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
