'use client'

import {
  ColumnDef,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import { UseTRPCQueryResult } from '@trpc/react-query/shared'
import { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { Input } from '../input'
import Loader from '../loader'

import { DataTablePagination } from './pagination'
import { DataTableViewOptions } from './view-options'

interface Props<T> {
  fetchFn: (input: {
    page: number
    perPage: number
    sortBy?: string
    order?: 'asc' | 'desc'
    search?: string
    dateFrom?: Date | undefined
    dateTo?: Date | undefined
  }) => UseTRPCQueryResult<
    {
      result: T[]
      pagination: {
        total: number
        page: number
        perPage: number
      }
    },
    unknown
  >
  columns: ColumnDef<T>[]
  children?: React.ReactNode
}

export function DataTable<T>({ columns, fetchFn, children }: Props<T>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState<string>('')

  const { data, isError, isLoading } = fetchFn({
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
    sortBy: sorting.length ? sorting[0].id : undefined,
    order: sorting.length ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
    search,
    dateFrom: undefined,
    dateTo: undefined
  })

  const table = useReactTable({
    data: data?.result || [],
    columns,
    rowCount: data?.pagination.total || 0,
    state: {
      pagination,
      sorting
    },
    initialState: {
      columnVisibility: {
        id: false
      }
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <section className='rounded-md border'>
      {children && (
        <div className='flex w-full flex-col justify-between gap-2 border-b p-2 lg:flex-row lg:items-center lg:gap-4 lg:p-4'>
          {children}
        </div>
      )}
      <div className='flex w-full flex-col items-center justify-between gap-1 border-b p-2 lg:flex-row lg:gap-4 lg:p-4'>
        <div className='flex w-full flex-col gap-2 md:flex-row'>
          <Input
            placeholder={'Search...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className='max-w-sm'
          />
        </div>
        <DataTableViewOptions table={table} />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className='w-full max-w-[calc(100vw-125px)] lg:max-w-[calc(100vw-300px)]'>
                  <Loader />
                </div>
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow className='!max-w-screen text-center font-bold'>
              <TableCell colSpan={columns.length}>
                <div className='w-full max-w-[calc(100vw-125px)] text-center font-bold lg:max-w-[calc(100vw-300px)]'>
                  Error loading data. Please try again later.
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className='w-full max-w-[calc(100vw-125px)] text-center font-bold lg:max-w-[calc(100vw-300px)]'>
                  No data available for the selected filters.
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <section className='flex w-full items-center justify-between gap-4 p-2 md:p-4'>
        <p className='text-sm font-medium'>
          Total: {data?.pagination.total || 0} items
        </p>
        <DataTablePagination table={table} />
      </section>
    </section>
  )
}
