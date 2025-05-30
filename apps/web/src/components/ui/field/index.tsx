import cn from 'clsx'
import { forwardRef } from 'react'

import { IField } from './field.interface'

const Field = forwardRef<HTMLInputElement, IField>(
  (
    {
      title,
      placeholder,
      error,
      className,
      inputClassName,
      type = 'text',
      style,
      ...rest
    },
    ref
  ) => (
    <div className={cn('mt-2 w-full', className)} style={style}>
      <label>
        <span className='text-lg font-semibold'>
          {title ? title : placeholder}
        </span>
        <input
          placeholder={placeholder}
          type={type}
          ref={ref}
          className={cn(
            'bg-input text-foreground placeholder:text-foreground/80 mt-1 w-full rounded-md border-2 px-4 py-2 font-medium transition-all outline-none',
            {
              '!border-red-500': error
            },
            inputClassName
          )}
          {...rest}
        />
      </label>
      {error && <div className='mt-1 font-medium text-red-500'>*{error}</div>}
    </div>
  )
)

Field.displayName = 'Field'

export default Field
