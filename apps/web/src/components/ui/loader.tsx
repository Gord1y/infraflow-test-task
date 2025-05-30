import { LucideLoader } from 'lucide-react'

import { cn } from '@/lib/utils'

interface Props {
  className?: string
  size?: number
}

const Loader: React.FC<Props> = ({ className, size = 42 }) => {
  return (
    <div className={cn('grid h-full w-full place-items-center', className)}>
      <LucideLoader className='text-primary animate-spin' size={size} />
    </div>
  )
}

export default Loader
