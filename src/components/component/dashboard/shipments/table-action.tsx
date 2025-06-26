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
  MarkPackageAsDelivered,
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
  const { statuses } = usePackageStatus()
  const [showEditDialog, setEditDialog] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [showRegisterDialog, setShowRegisterDialog] = React.useState(false)
  const [showDeliveredDialog, setShowDeliveredDialog] = React.useState(false)
  const [isMarkingDelivered, setIsMarkingDelivered] = React.useState(false)
  const [currentEmployee, setCurrentEmployee] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  // Move useForm to the top - hooks must be called in the same order every render
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

  async function handleMarkAsDelivered() {
    setIsMarkingDelivered(true)
    try {
      const result = await MarkPackageAsDelivered(package_.id!)
      if (result?.success) {
        toast({
          title: 'Success',
          description: 'Package marked as delivered successfully.',
        })
        // Refresh the page to show updated package list
        window.location.reload()
      } else {
        toast({
          title: 'Error',
          description: result?.error || 'Failed to mark package as delivered.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      })
    } finally {
      setIsMarkingDelivered(false)
      setShowDeliveredDialog(false)
    }
  }

  // Check if user can edit/delete packages (admin or "on hold" status)
  const canEditOrDelete = React.useMemo(() => {
    console.log('=== CHECKING EDIT/DELETE PERMISSIONS ===')
    console.log('Current employee:', currentEmployee)
    console.log('Loading state:', loading)

    if (loading) {
      console.log('Still loading employee data...')
      return false
    }

    if (!currentEmployee) {
      console.log('No current employee/user found')
      return false
    }

    // Check if user has admin or manager roles (they can always edit/delete)
    const userRoles = currentEmployee.roles || []
    console.log('Current user roles:', userRoles)
    console.log('Employee/User object keys:', Object.keys(currentEmployee))
    console.log('Is employee?', currentEmployee.isEmployee)

    if (userRoles.includes('admin') || userRoles.includes('manager')) {
      console.log('User is admin/manager - can edit/delete any package')
      return true
    }

    // For non-admin users (both employees and regular users), only allow edit/delete for "on hold" packages
    const packageStatus = package_.status?.toLowerCase()
    console.log('Package status (lowercase):', packageStatus)
    const canEdit = packageStatus === 'on hold'
    console.log('Non-admin user can edit/delete based on status:', canEdit)
    console.log('=== END EDIT/DELETE CHECK ===')
    return canEdit
  }, [currentEmployee, package_.status, loading])

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

  // Check if user is a courier
  const isCourier = React.useMemo(() => {
    if (!currentEmployee) return false
    const positionType = currentEmployee.position?.toLowerCase()
    return positionType === 'courier'
  }, [currentEmployee])

  // Check if package can be marked as delivered (status is "in delivering" and user is courier)
  const packageCanBeDelivered = React.useMemo(() => {
    return package_.status?.toLowerCase() === 'in delivering' && isCourier
  }, [package_.status, isCourier])

  // Fetch current employee info on component mount
  React.useEffect(() => {
    console.log('Fetching current employee...')
    async function fetchCurrentEmployee() {
      try {
        setLoading(true)

        // Get both current user and employee data
        const [employee, user] = await Promise.all([
          GetCurrentEmployee(),
          import('@/lib/auth_actions').then(module => module.GetCurrentUser()),
        ])

        console.log('Current employee fetched:', employee)
        console.log('Current user fetched:', user)

        // If user exists but no employee record, treat user as a regular user
        if (user && !employee) {
          console.log('User exists but no employee record - treating as regular user')
          setCurrentEmployee({
            id: user.id,
            roles: user.roles || [],
            position: null, // No position for non-employees
            isEmployee: false,
          })
        } else if (employee) {
          // Combine employee data with user roles
          const employeeWithRoles = {
            ...employee,
            roles: user?.roles || [], // Add user roles to employee object
            isEmployee: true,
          }
          console.log('Employee with roles:', employeeWithRoles)
          setCurrentEmployee(employeeWithRoles)
        } else {
          console.log('No user or employee found')
          setCurrentEmployee(null)
        }
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
  console.log('canEditOrDelete:', canEditOrDelete)
  console.log('packageCanBeDelivered:', packageCanBeDelivered)
  console.log('Current employee:', currentEmployee)
  console.log('Package status:', package_.status)
  console.log('Loading employee:', loading)

  // If still loading, show a loading state
  if (loading) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Loading...</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

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

          {canEditOrDelete && (
            <DropdownMenuItem onSelect={() => setEditDialog(true)}>Edit</DropdownMenuItem>
          )}

          {canRegister && packageCanBeRegistered && (
            <DropdownMenuItem
              onSelect={() => setShowRegisterDialog(true)}
              className="text-green-600"
            >
              Register Package
            </DropdownMenuItem>
          )}
          {packageCanBeDelivered && (
            <DropdownMenuItem
              onSelect={() => setShowDeliveredDialog(true)}
              className="text-blue-600"
            >
              Mark as Delivered
            </DropdownMenuItem>
          )}
          {canEditOrDelete && (
            <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)} className="text-red-600">
              Delete
            </DropdownMenuItem>
          )}
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
                {/* Only show status field for employees (not regular users) */}
                {currentEmployee?.isEmployee && (
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
                )}
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
      <AlertDialog open={showDeliveredDialog} onOpenChange={setShowDeliveredDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark Package as Delivered</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this package as delivered? This action confirms that the
              package has been successfully delivered to the recipient.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMarkingDelivered}>Cancel</AlertDialogCancel>
            <Button
              variant="default"
              onClick={handleMarkAsDelivered}
              disabled={isMarkingDelivered}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isMarkingDelivered ? 'Marking as Delivered...' : 'Mark as Delivered'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
