'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
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
import { changeCustomerData } from '@/lib/form_action'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AddUserPartial } from '@/lib/user_actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Offices, Positions, Roles, Users } from '@/types/dashboard'
import { AddEmployeePartial } from '@/lib/employee_actions'

const formSchema = z.object({
  id: z.string(),
  salary: z.string(),
  officeId: z.string(),
  positionId: z.string(),
})

export function CreateEmployee({
  users,
  offices,
  position,
}: {
  users: Users
  offices: Offices
  position: Positions
}) {
  const router = useRouter()

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    console.log('We in handleSubmit')
    let formData = new FormData()
    formData.append('positionId', data.positionId)
    formData.append('officeId', data.officeId)
    formData.append('salary', data.salary)
    formData.append('id', data.id)

    const result = await AddEmployeePartial(formData)

    if (result?.success) {
      toast({
        title: 'Success',
        description: 'Employee has been created successfully.',
      })
      // Navigate back to employees page
      router.push('/dashboard/employees')
      router.refresh() // Refresh the page to show updated data
    } else {
      toast({
        title: 'Error',
        description: result?.error || 'Failed to create employee',
        variant: 'destructive',
      })
    }
  }
  const [showEditDialog, setEditDialog] = React.useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      salary: '',
    },
  })
  const formButtonRef = React.useRef<HTMLButtonElement>(null)
  return (
    <>
      <Button variant={'outline'} onClick={() => setEditDialog(true)}>
        Create
      </Button>
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
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a valid role to add" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users?.map(user => (
                            <SelectItem key={user.id} value={user.id!}>
                              {user.email!}
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
                  name="positionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a valid role to add" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {position?.map(position => (
                            <SelectItem key={position.id} value={position.id!.toString()}>
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
                  name="officeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a valid office to add" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {offices?.map(office => (
                            <SelectItem key={office.id} value={office.id!.toString()}>
                              {office.address!}
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
    </>
  )
}
