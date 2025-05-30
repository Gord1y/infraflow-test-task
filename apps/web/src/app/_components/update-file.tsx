'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import Field from '@/components/ui/field'

import { IFile, IUpdateFile } from '@/types/file.interface'

import { trpc } from '@/lib/trpc-client'

interface Props {
  initial: IFile
}

const UpdateFile: React.FC<Props> = ({ initial }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IUpdateFile>({
    mode: 'onChange',
    defaultValues: initial
  })

  useEffect(() => {
    reset(initial)
  }, [initial, reset])

  const queryClient = useQueryClient()
  const { mutate, isPending } = trpc.updateFile.useMutation({
    mutationKey: ['update-file', initial.id],
    onSuccess: async () => {
      toast.success('File updated successfully')
      await queryClient.refetchQueries()
      reset()
      setIsOpen(false)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => {
      toast.error(e.response.data.message ?? 'Update failed')
    }
  })

  const onSubmit: SubmitHandler<IUpdateFile> = async data => mutate(data)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Update</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Update File: {initial.name}</DialogTitle>
          <DialogDescription>Update the file details below</DialogDescription>
        </DialogHeader>
        <form className='grid gap-4 py-4' onSubmit={handleSubmit(onSubmit)}>
          <Field
            title={'File name'}
            placeholder={'Enter the name of the file'}
            autoComplete='fileName'
            {...register('name', {
              required: 'This field is required',
              maxLength: {
                value: 100,
                message: 'File name must be less than 100 characters'
              },
              minLength: {
                value: 2,
                message: 'File name must be at least 2 characters long'
              }
            })}
            error={errors.name?.message}
          />
        </form>
        <DialogFooter className='gap-2'>
          <Button disabled={isPending} onClick={() => setIsOpen(false)}>
            Discard
          </Button>
          <Button
            type='submit'
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            variant='destructive'
          >
            {isPending ? 'Loading...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateFile
