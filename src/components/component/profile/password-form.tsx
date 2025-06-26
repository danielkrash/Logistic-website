'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from 'sonner'
import type { components } from '@/types/schemav3'
import { format } from 'date-fns'
import { changeData, changePassword } from '@/lib/user_actions'

const accountFormSchema = z.object({
  current_password: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  new_password: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
})

let res = {
  type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
  title: 'Invalid password',
  status: 400,
  detail: 'Current password is invalid',
  errors: {
    PasswordMismatch: ['Incorrect password.'],
  },
}
type AccountFormValues = z.infer<typeof accountFormSchema>
type User = components['schemas']['UserDto'] | null | undefined

export function ChangePasswordForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
  })

  async function onSubmit(data: AccountFormValues) {
    let formData = new FormData()
    formData.append('currentPassword', data.current_password)
    formData.append('newPassword', data.new_password)
    console.log(data)
    let result = await changePassword(formData)
    console.log(result)
    if (result.status === 400) {
      toast('Password is incorect', {
        description: <div>{JSON.stringify(result.errors)}</div>,
        action: {
          label: 'Action',
          onClick: () => console.log('Action!'),
        },
      })
    } else
      toast('Succesfull', {
        action: {
          label: 'Action',
          onClick: () => console.log('Action!'),
        },
      })
  }
  return (
    <div className="grid gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-10 my-10 space-y-5">
          <div className="max-w-64">
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      className=""
                      type="password"
                      placeholder="Your current password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="max-w-64">
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      className=""
                      type="password"
                      placeholder="Your new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Update account</Button>
        </form>
      </Form>
    </div>
  )
}
