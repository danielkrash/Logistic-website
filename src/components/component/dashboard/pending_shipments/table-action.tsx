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
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { toast } from '@/components/ui/use-toast'
import type { Package } from '@/types/dashboard'
import { AssignCourierToPackage } from '@/lib/package_actions'
import { cn } from '@/lib/utils'

const assignCourierSchema = z.object({
  deliveryDate: z
    .date({
      required_error: 'A delivery date is required.',
    })
    .refine(date => date > new Date(), {
      message: 'Delivery date must be in the future.',
    }),
})

export function PendingShipmentTableActions({ package_ }: { package_: Package }) {
  const [showAssignDialog, setShowAssignDialog] = React.useState(false)
  const [isAssigning, setIsAssigning] = React.useState(false)

  const form = useForm<z.infer<typeof assignCourierSchema>>({
    resolver: zodResolver(assignCourierSchema),
  })

  async function onAssign(values: z.infer<typeof assignCourierSchema>) {
    setIsAssigning(true)
    try {
      // Convert to UTC and format for C# DateTime (ISO 8601 UTC format)
      const deliveryDate = values.deliveryDate.toISOString()

      console.log('Assigning package:', {
        packageId: package_.id,
        deliveryDate: deliveryDate,
        originalDate: values.deliveryDate,
        utcDate: new Date(deliveryDate),
      })

      const result = await AssignCourierToPackage(package_.id!, deliveryDate)

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Package assigned to you successfully.',
        })
        setShowAssignDialog(false)
        form.reset()
        // Refresh the page or trigger a re-fetch
        window.location.reload()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to assign package.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Assignment error:', error)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      })
    } finally {
      setIsAssigning(false)
    }
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
            Copy tracking number
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setShowAssignDialog(true)}
            className="text-blue-600"
            disabled={package_.courierId != null}
          >
            {package_.courierId ? 'Already Assigned' : 'Assign to Me'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Assign Package to Yourself</AlertDialogTitle>
            <AlertDialogDescription>
              Select a delivery date for package #{package_.trackingNumber}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAssign)} className="space-y-6">
              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Delivery Date & Time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={(date: Date) => date < new Date()}
                        placeholder="Pick a delivery date and time"
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>
                      Select the expected delivery date and time for this package.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type="submit" disabled={isAssigning}>
                  {isAssigning ? 'Assigning...' : 'Assign to Me'}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
