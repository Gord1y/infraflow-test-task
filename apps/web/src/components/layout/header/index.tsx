import Link from 'next/link'

import Section from '../section'

import MenuDropdown from './menu'

const Header: React.FC = () => {
  return (
    <header className='bg-background lg:bg-background/90 sticky top-0 left-0 z-50 flex w-full flex-col justify-center gap-2 py-2 lg:backdrop-blur-sm'>
      <Section className='flex h-12 items-center justify-between gap-2 lg:h-16'>
        <div className='flex h-12 flex-row items-center gap-5 lg:h-16'>
          <Link href={'/'}>
            <h1 className='text-primary text-2xl font-bold lg:text-4xl'>
              Infraflow
            </h1>
          </Link>
        </div>
        <div className='flex flex-row gap-2'>
          <MenuDropdown />
        </div>
      </Section>
    </header>
  )
}

export default Header
