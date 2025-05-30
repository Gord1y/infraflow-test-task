'use client'

import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'

import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'

export default function ThemeSwither() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className='flex w-full flex-row justify-start gap-2'>
        <Sun className='h-6 w-6 dark:hidden' />
        <Moon className='hidden h-6 w-6 dark:block' />
        <p>Select theme:</p>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className='p-1 md:p-2'>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setTheme('light')}
              className='flex w-full items-center justify-between'
            >
              Light
              <span className='block size-6 dark:hidden'>✓</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme('dark')}
              className='flex w-full items-center justify-between'
            >
              Dark
              <span className='hidden size-6 dark:block'>✓</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
