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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import type { Company } from '@/types/dashboard'
import { changeCustomerData } from '@/lib/form_action'
import { changeCompanyDataById, getCompanyRevenue } from '@/lib/company_actions'
import { GetCurrentEmployee } from '@/lib/employee_actions'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Please enter a valid name.',
  }),
  address: z.string().min(2, {
    message: 'Please enter a valid address.',
  }),
  id: z.string(),
})

async function handleSubmit(data: z.infer<typeof formSchema>) {
  let formData = new FormData()
  formData.append('name', data.name)
  formData.append('address', data.address)
  formData.append('id', data.id.toString())
  await changeCompanyDataById(formData)
}

export function CompanyTableActions({ data }: { data: Company }) {
  const [showEditDialog, setEditDialog] = React.useState(false)
  const [showValidForm, setValidForm] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [currentEmployee, setCurrentEmployee] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [isGeneratingRevenue, setIsGeneratingRevenue] = React.useState(false)

  // Check if user is admin or manager
  const canGenerateRevenue = React.useMemo(() => {
    if (!currentEmployee) return false
    const userRoles = currentEmployee.roles || []
    return userRoles.includes('admin') || userRoles.includes('manager')
  }, [currentEmployee])

  // Fetch current employee info on component mount
  React.useEffect(() => {
    async function fetchCurrentEmployee() {
      try {
        setLoading(true)
        const employee = await GetCurrentEmployee()
        setCurrentEmployee(employee)
      } catch (error) {
        console.error('Failed to fetch current employee:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentEmployee()
  }, [])

  async function handleGenerateRevenue() {
    setIsGeneratingRevenue(true)
    try {
      await getCompanyRevenue(Number(data.id))
      toast({
        title: 'Success',
        description: 'Revenue data generated successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate revenue data.',
        variant: 'destructive',
      })
    } finally {
      setIsGeneratingRevenue(false)
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name ?? '',
      address: data?.address ?? '',
      id: data?.id?.toString(),
    },
  })

  const formButtonRef = React.useRef<HTMLButtonElement>(null)
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
              navigator.clipboard.writeText(String(data.id))
            }}
          >
            Copy company ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setEditDialog(true)}>Edit</DropdownMenuItem>
          {canGenerateRevenue && (
            <DropdownMenuItem
              onSelect={() => handleGenerateRevenue()}
              className="text-blue-600"
              disabled={isGeneratingRevenue}
            >
              {isGeneratingRevenue ? 'Generating...' : 'Generate Revenue Data'}
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="name" {...field} />
                      </FormControl>
                      {/* <FormDescription>This is your public display name.</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>address</FormLabel>
                      <FormControl>
                        <Input placeholder="address" {...field} />
                      </FormControl>
                      {/* <FormDescription>This is your public display name.</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>id</FormLabel>
                      <FormControl>
                        <Input disabled placeholder="id" {...field} />
                      </FormControl>
                      {/* <FormDescription>This is your public display name.</FormDescription> */}
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
                  description: 'This preset has been created.',
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
              onClick={() => {
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
    </>
  )
}
