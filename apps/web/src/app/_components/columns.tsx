'use client'

import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { DataTableColumnHeader } from '@/components/ui/data-table/column-header'
import MutationActionButton from '@/components/ux/mutation-action-button'

import { IFile } from '@/types/file.interface'

import UpdateFile from './update-file'
import { trpc } from '@/lib/trpc-client'
import { formatId } from '@/lib/utils'

export const columns: ColumnDef<IFile>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} name='ID' />,
    cell: ({ row }) => {
      return (
        <button
          onClick={() => {
            navigator.clipboard.writeText(row.original.id)
            toast.success('ID copied to clipboard')
          }}
        >
          {formatId(row.original.id)}
        </button>
      )
    }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} name='Name' />
    ),
    cell: ({ row }) => {
      return row.original.name
    }
  },
  {
    accessorKey: 'size',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} name='Size' />
    ),
    cell: ({ row }) => {
      return `${(row.original.size / 1024).toFixed(2)} KB`
    }
  },
  {
    accessorKey: 'contentType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} name='Content Type' />
    ),
    cell: ({ row }) => {
      return row.original.contentType
    }
  },
  {
    accessorKey: 'key',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} name='Key' />
    ),
    cell: ({ row }) => {
      return row.original.key
    }
  },
  {
    accessorKey: 'url',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} name='URL' />
    ),
    cell: ({ row }) => {
      return row.original.url
    }
  },
  {
    accessorKey: 'bucket',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} name='Bucket' />
    ),
    cell: ({ row }) => {
      return row.original.bucket
    }
  },
  {
    accessorKey: 'region',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} name='Region' />
    ),
    cell: ({ row }) => {
      return row.original.region
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} name='Created At' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return (
        <div>
          {date.toLocaleDateString('us-Uk', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          })}
        </div>
      )
    }
  },
  {
    accessorKey: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} name='Actions' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center gap-2'>
          <UpdateFile initial={row.original} />
          <MutationActionButton
            mutateFn={trpc.deleteFile.useMutation}
            data={{
              id: row.original.id
            }}
            successMessage='File deleted successfully'
            errorMessage='Failed to delete file'
            buttonTitle='Delete'
            title='Delete File'
            description='Are you sure you want to delete this file? This action cannot be undone.'
          />
        </div>
      )
    },
    enableSorting: false
  }
]
