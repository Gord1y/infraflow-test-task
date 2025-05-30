import { PropsWithChildren } from 'react'

import Section from '../section'

const Main: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Section as='main' className='flex flex-col gap-2 pt-2 lg:gap-5'>
      {children}
    </Section>
  )
}

export default Main
