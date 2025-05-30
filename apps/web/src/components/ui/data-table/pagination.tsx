import { Table } from '@tanstack/react-table'
import {
  ArrowBigLeftDash,
  ArrowBigRight,
  ArrowBigRightDash
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table
}: DataTablePaginationProps<TData>) {
  return (
    <div className='flex flex-wrap items-center justify-center gap-1 md:gap-2'>
      <div className='flex items-center justify-between gap-1 md:gap-2'>
        <p className='text-sm font-medium'>Per Page: </p>
        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={(value: string) => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger className='h-8 w-[70px]'>
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side='top'>
            {[5, 15, 30, 45, 60, 75, 90, 100].map(pageSize => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
        Page {table.getState().pagination.pageIndex + 1} from{' '}
        {table.getPageCount()}
      </div>
      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          className='flex h-8 w-8 p-0'
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className='sr-only'>Go to first page</span>
          <ArrowBigLeftDash className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='h-8 w-8 p-0'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className='sr-only'>Go to previous page</span>
          <ArrowBigRight className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='h-8 w-8 p-0'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className='sr-only'>Go to next page</span>
          <ArrowBigRight className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='flex h-8 w-8 p-0'
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className='sr-only'>Go to last page</span>
          <ArrowBigRightDash className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
