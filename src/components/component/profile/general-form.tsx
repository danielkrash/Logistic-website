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
import { changeData } from '@/lib/user_actions'

const accountFormSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 30 characters.',
    })
    .nullable(),
  lastName: z.string().min(2, { message: 'Name must be at least 2 characters.' }).nullable(),
  email: z.string().email().nullable(),
  address: z.string().min(5, { message: 'Address must be at least 10 characters.' }).nullable(),
  dob: z
    .date({
      required_error: 'A date of birth is required.',
    })
    .nullable(),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters.' }).nullable(),
})

type AccountFormValues = z.infer<typeof accountFormSchema>
type User = components['schemas']['UserDto'] | null | undefined

export function GeneralProfileForm({ user }: { user: User }) {
  const defaultValues: Partial<AccountFormValues> = {
    // name: "Your name",
    // dob: new Date("2023-01-23"),
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    address: user?.address,
    dob: user?.birthDate ? new Date(user.birthDate) : new Date(),
    phone: user?.phoneNumber,
  }
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  async function onSubmit(data: AccountFormValues) {
    var birthday_data = null
    if (data.dob) {
      birthday_data = format(data.dob, 'yyyy-MM-dd')
    }
    let formData = new FormData()
    formData.append('firstName', data.firstName ?? '')
    formData.append('lastName', data.lastName ?? '')
    formData.append('email', data.email ?? '')
    formData.append('address', data.address ?? '')
    formData.append('phone', data.phone ?? '')
    formData.append('dob', birthday_data ?? '')
    await changeData(formData)
    console.log('Pressed', data)
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
          <div className="grid grid-cols-6 gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="max-w-64">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        className=""
                        placeholder="Your name"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="max-w-64">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        className=""
                        placeholder="Your  last name"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="max-w-64">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className=""
                      placeholder="Your email"
                      {...field}
                      value={field.value ?? ''}
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
              name="address"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      className=""
                      placeholder="Your address"
                      {...field}
                      value={field.value ?? ''}
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
              name="phone"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input
                      className=""
                      placeholder="Your phone number"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? new Date()}
                      onSelect={field.onChange}
                      disabled={date => date > new Date() || date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update account</Button>
        </form>
      </Form>
    </div>
  )
}
