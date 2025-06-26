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

export function PendingShipmentTableActions({ package_ }: { package_: Package }) {
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
  const { statuses } = usePackageStatus()
  const [showEditDialog, setEditDialog] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
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
          <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)} className="text-blue-400">
            Register
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This preset will be registered
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={async () => {
                await RegisterPackageById(package_.id!)
                toast({
                  description: 'This preset has been registered.',
                })
                setShowDeleteDialog(false)
              }}
            >
              Register
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
