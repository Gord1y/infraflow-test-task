'use client'

import { useRouter } from 'next/navigation'

import { Button } from '../ui/button'

const Back = () => {
  const { back } = useRouter()

  return (
    <Button variant={'destructive'} size={'lg'} onClick={() => back()}>
      Go Back
    </Button>
  )
}

export default Back
