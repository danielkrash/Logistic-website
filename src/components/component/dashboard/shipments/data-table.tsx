'use client'

import * as React from 'react'
import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Row,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteRows } from '@/lib/delete-rows'
import { CreatePackage } from './create-package'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[] extends Array<infer U> ? U[] : TData[]
}

export function ShipmentTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const deletableData = table
    .getSelectedRowModel()
    .flatRows.map(row => row.original)
    .map(row => (row as { id: string }).id)

  return (
    <div className="w-full space-y-6">
      {/* Header with filters and actions */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative">
            <Input
              placeholder="Filter by status..."
              value={(table.getColumn('status')?.getFilterValue() as string) ?? ''}
              onChange={event => table.getColumn('status')?.setFilterValue(event.target.value)}
              className="h-10 w-64 border-gray-200 pl-4 pr-4 transition-colors focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{table.getFilteredRowModel().rows.length} package(s)</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <CreatePackage />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 border-gray-200 hover:bg-gray-50">
                View <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={value => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="border-b border-gray-200">
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      className="h-12 px-4 text-left align-middle font-medium text-gray-900"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50/50"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                  No packages found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer with pagination and selection info */}
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected
          </span>
          {table.getIsSomeRowsSelected() && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => deleteRows(deletableData)}
              className="ml-4 h-8 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
            >
              Delete selected
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 border-gray-200 p-0 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ←
          </Button>
          <div className="flex min-w-[100px] items-center justify-center text-sm font-medium text-gray-700">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 border-gray-200 p-0 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            →
          </Button>
        </div>
      </div>
    </div>
  )
}
