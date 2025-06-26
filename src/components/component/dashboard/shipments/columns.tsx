'use client'

import { type ColumnDef } from '@tanstack/react-table'
import type { Package, Packages } from '@/types/dashboard'
import { ShipmentTableActions } from './table-action'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

// export const columns: ColumnDef<Packages>[] = [
//   {
//     accessorKey: "status",
//     header: "Status",
//   },
//   {
//     accessorKey: "createdAt",
//     header: "CreatedAt",
//   },
//   {
//     accessorKey: "weight",
//     header: "Weight",
//   },
//   {
//     accessorKey: "Sender",
//     header: "Sender"
//   },
//   {
//     accessorKey: "Resiver",
//     header: "Resiver"
//   }
// ]

export const shipmentColumns: ColumnDef<Package>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'trackingNumber',
    header: 'Tracking Number',
    cell: ({ row }) => <div className="capitalize">{row.getValue('trackingNumber')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const statusLower = status?.toLowerCase()

      // Define badge variants and colors for different statuses
      let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default'
      let badgeClasses = ''

      switch (statusLower) {
        case 'on hold':
          badgeVariant = 'outline'
          badgeClasses = 'border-orange-500 text-orange-700 bg-orange-50'
          break
        case 'delivered':
          badgeVariant = 'default'
          badgeClasses = 'bg-green-600 text-white'
          break
        case 'in delivering':
          badgeVariant = 'default'
          badgeClasses = 'bg-blue-600 text-white'
          break
        case 'canceled':
          badgeVariant = 'destructive'
          badgeClasses = 'bg-red-600 text-white'
          break
        case 'wait courier':
          badgeVariant = 'secondary'
          badgeClasses = 'bg-yellow-100 text-yellow-800 border-yellow-300'
          break
        default:
          badgeVariant = 'outline'
          badgeClasses = 'border-gray-300 text-gray-700'
      }

      return (
        <Badge variant={badgeVariant} className={badgeClasses}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'senderEmail',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Sender
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('senderEmail')}</div>,
  },
  {
    accessorKey: 'receiverEmail',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Receiver
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('receiverEmail')}</div>,
  },
  {
    accessorKey: 'packageInfo.weight',
    header: () => <div className="">Weight</div>,
    cell: ({ row }) => {
      const value = row.original.packageInfo?.weight
      return <div className="font-medium">{value}</div>
    },
  },
  {
    accessorKey: 'price',
    header: () => <div className="">Price</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('price')}</div>
    },
  },
  {
    accessorKey: 'companyName',
    header: () => <div className="">Comapany Name</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('companyName')}</div>
    },
  },
  {
    accessorKey: 'deliveryAddress',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Adress
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('deliveryAddress')}</div>,
  },
  {
    accessorKey: 'toAdress',
    header: 'To User Adress',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('toAdress') ? 'true' : 'false'}</div>
    ),
  },
  {
    accessorKey: 'courierId',
    header: 'Courier Id',
    cell: ({ row }) => <div className="">{row.getValue('courierId')}</div>,
  },
  {
    accessorKey: 'registarEmployeeEmail',
    header: 'Registrar',
    cell: ({ row }) => <div className="">{row.getValue('registarEmployeeEmail')}</div>,
  },
  {
    accessorKey: 'deliveryDate',
    header: 'Delivery Date',
    cell: ({ row }) => <div className="capitalize">{row.getValue('deliveryDate')}</div>,
  },
  {
    accessorKey: 'shippingDate',
    header: 'Shipping Date',
    cell: ({ row }) => <div className="capitalize">{row.getValue('shippingDate')}</div>,
  },
  {
    accessorKey: 'packageInfo.fragile',
    header: 'Fragile',
    cell: ({ row }) => {
      const isFragile = row.original.packageInfo?.fragile
      return <div className="capitalize">{isFragile ? 'true' : 'false'}</div>
    },
  },
  {
    accessorKey: 'packageInfo.hazardous',
    header: 'Hazardous',
    cell: ({ row }) => {
      const isHazardous = row.original.packageInfo?.hazardous
      return <div className="capitalize">{isHazardous ? 'true' : 'false'}</div>
    },
  },
  {
    accessorKey: 'packageInfo.description',
    header: 'Description',
    cell: ({ row }) => {
      const Description = row.original.packageInfo?.description
      return (
        <ScrollArea>
          <div className="capitalize">{Description}</div>
        </ScrollArea>
      )
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original
      return (
        // <DropdownMenu>
        //   <DropdownMenuTrigger asChild>
        //     <Button variant="ghost" className="h-8 w-8 p-0">
        //       <span className="sr-only">Open menu</span>
        //       <DotsHorizontalIcon className="h-4 w-4" />
        //     </Button>
        //   </DropdownMenuTrigger>
        //   <DropdownMenuContent align="end">
        //     <DropdownMenuLabel>Actions</DropdownMenuLabel>
        //     <DropdownMenuItem
        //       onClick={() => navigator.clipboard.writeText(payment.id)}
        //     >
        //       Copy payment ID
        //     </DropdownMenuItem>
        //     <DropdownMenuSeparator />
        //     <DropdownMenuItem>View customer</DropdownMenuItem>
        //     <DropdownMenuItem>View payment details</DropdownMenuItem>
        //   </DropdownMenuContent>
        // </DropdownMenu>
        <ShipmentTableActions package_={payment} />
      )
    },
  },
]
