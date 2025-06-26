'use client'

import * as React from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import useSWR, { preload } from 'swr'
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
import { changeCustomerData } from '@/lib/form_action'
import { add, format } from 'date-fns'
import { type Employee, type User } from '@/types/dashboard'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  changeUserDataById,
  DeleteUserById,
  DeleteUserRoleById,
  role_fetcher,
  user_fetcher,
} from '@/lib/user_actions'
import { useRef } from 'react'
import { getRoles } from '@/lib/company_actions'
import {
  changeEmployeeDataById,
  DeleteEmployeeById,
  position_fetcher,
} from '@/lib/employee_actions'

const formSchema = z.object({
  officeId: z.string().optional(),
  positionId: z.string().optional(),
  salary: z.string(),
  id: z.string(),
})
const formSchemaDelete = z.object({
  role: z.string(),
  id: z.string().min(2, {
    message: 'Please enter a valid id.',
  }),
})

type UserFormValues = z.infer<typeof formSchema>

async function handleSubmit(data: UserFormValues) {
  console.log('Form data being submitted:', data)
  let formData = new FormData()
  if (data.officeId) formData.append('officeId', data.officeId.toString())
  if (data.positionId) formData.append('positionId', data.positionId.toString())
  formData.append('salary', data.salary.toString())
  formData.append('id', data.id)
  console.log('FormData contents:')
  for (let [key, value] of formData.entries()) {
    console.log(key, value)
  }

  const result = await changeEmployeeDataById(formData)

  if (result?.success) {
    toast({
      title: 'Success',
      description: 'Employee has been updated successfully.',
    })
  } else {
    toast({
      title: 'Error',
      description: result?.error || 'Failed to update employee',
      variant: 'destructive',
    })
  }
}

function usePositions() {
  const { data } = useSWR('http://localhost:7028/position', position_fetcher, {
    refreshInterval: 60000,
  })
  return {
    positions: data,
  }
}

export function EmployeeTableActions({ data: employee }: { data: Employee }) {
  const { positions } = usePositions()

  const defaultValues: Partial<UserFormValues> = {
    officeId: employee?.officeId?.toString() ?? '',
    salary: employee?.salary?.toString() ?? '',
    positionId: '',
    id: employee?.id ?? '',
  }
  const [showEditDialog, setEditDialog] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // Update form values when positions data loads
  React.useEffect(() => {
    console.log('Positions loaded:', positions)
    console.log('Employee position:', employee?.position)
    if (positions && employee?.position) {
      const currentPositionId =
        positions.find(pos => pos.type === employee.position)?.id?.toString() ?? ''
      console.log('Found position ID:', currentPositionId)
      form.setValue('positionId', currentPositionId)
    }
  }, [positions, employee?.position, form])
  const formButtonRef = React.useRef<HTMLButtonElement>(null)
  const fromRef = useRef<HTMLFormElement>(null)
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
              navigator.clipboard.writeText(employee.id ?? '')
            }}
          >
            Copy client ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setEditDialog(true)}>Edit</DropdownMenuItem>
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
              <form ref={fromRef} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>id</FormLabel>
                      <FormControl>
                        <Input disabled placeholder="id" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="positionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a valid position to add" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {positions?.map(position => (
                            <SelectItem key={position.id} value={position.id?.toString()!}>
                              {position.type!}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary</FormLabel>
                      <FormControl>
                        <Input placeholder="salary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="hidden" variant={'default'} ref={formButtonRef} type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="outline"
              onClick={() => {
                fromRef.current?.requestSubmit()
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
              onClick={async () => {
                const result = await DeleteEmployeeById(employee?.id!)

                if (result?.success) {
                  toast({
                    title: 'Success',
                    description: 'Employee has been deleted successfully.',
                  })
                  setShowDeleteDialog(false)
                } else {
                  toast({
                    title: 'Error',
                    description: result?.error || 'Failed to delete employee',
                    variant: 'destructive',
                  })
                }
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
