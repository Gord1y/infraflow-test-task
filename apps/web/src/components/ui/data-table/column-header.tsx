import { Column } from '@tanstack/react-table'
import { ChevronDown, ChevronUp, EyeOff, SortAscIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { cn } from '@/lib/utils'

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  name: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  name,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{name}</div>
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='data-[state=open]:bg-accent -ml-3 h-8'
          >
            <span>{name}</span>
            {column.getIsSorted() === 'desc' ? (
              <ChevronDown className='ml-2 h-4 w-4' />
            ) : column.getIsSorted() === 'asc' ? (
              <ChevronUp className='ml-2 h-4 w-4' />
            ) : (
              <SortAscIcon className='ml-2 h-4 w-4' />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ChevronUp className='text-muted-foreground/70 mr-2 h-3.5 w-3.5' />
            Sort by {name} (asc)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ChevronDown className='text-muted-foreground/70 mr-2 h-3.5 w-3.5' />
            Sort by {name} (desc)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className='text-muted-foreground/70 mr-2 h-3.5 w-3.5' />
            {column.getIsVisible() ? 'Hide ' + name : 'Show ' + name}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
