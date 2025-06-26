'use client'

import { type ColumnDef } from '@tanstack/react-table'
import type { Package, Packages } from '@/types/dashboard'
import { PendingShipmentTableActions } from './table-action'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { getStatusBadgeProps } from '@/lib/user-utils'
import { formatDateWithTime, formatDateShort } from '@/lib/date-utils'

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

export const pendingShipmentColumns: ColumnDef<Package>[] = [
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
      const { badgeVariant, badgeClasses } = getStatusBadgeProps(status)

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
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{formatDateWithTime(row.getValue('deliveryDate'))}</div>
    ),
  },
  {
    accessorKey: 'shippingDate',
    header: 'Shipping Date',
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{formatDateShort(row.getValue('shippingDate'))}</div>
    ),
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
      return <PendingShipmentTableActions package_={payment} />
    },
  },
]
