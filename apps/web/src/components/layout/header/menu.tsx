'use client'

import { Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { PAGES } from '@/config/pages'

import ThemeSwither from './theme-switcher'

const MenuDropdown: React.FC = () => {
  const { push } = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='size-8 lg:size-10'>
          <Menu className='size-5 lg:size-7' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-56'
        collisionPadding={10}
        sideOffset={6}
      >
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {PAGES.filter(page => page.isMenu).map((page, index) => (
            <DropdownMenuItem key={index} onClick={() => push(page.href)}>
              {page.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <ThemeSwither />
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => push('/auth')}
          className='mt-1 p-0'
          asChild
        >
          <Button variant='default' className='w-full'>
            Login / Register
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MenuDropdown
