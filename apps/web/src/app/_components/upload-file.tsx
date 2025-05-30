'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import Field from '@/components/ui/field'

import { ICreateFile, IFile } from '@/types/file.interface'

const UploadFile: React.FC = () => {
  const [percent, setPercent] = useState<number>(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ICreateFile>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      fileList: undefined
    }
  })

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationKey: ['upload-file'],
    mutationFn: async (formData: FormData) => {
      const resp = await axios.post<{
        message: string
        result: IFile
      }>('http://localhost:4000/api/v1/uploadFile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => {
          if (e.total) {
            setPercent(Math.round((e.loaded * 100) / e.total))
          }
        }
      })

      return resp.data
    },
    onSuccess: async () => {
      toast.success('File uploaded successfully')
      await queryClient.refetchQueries()
      reset()
      setPercent(0)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => {
      toast.error(e.response.data.message ?? 'Upload failed')
      setPercent(0)
    }
  })

  const onSubmit: SubmitHandler<ICreateFile> = async data => {
    if (!data.fileList || data.fileList.length === 0) {
      toast.error('Please select a file to upload')
      return
    }
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('file', data.fileList[0])
    mutate(formData)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      encType='multipart/form-data'
      className='mx-auto flex w-full max-w-md flex-col gap-4 p-4'
    >
      <h2 className='text-lg font-semibold'>Upload File</h2>
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
      <Field
        title={'File'}
        placeholder={'Select a file to upload'}
        autoComplete='file'
        type='file'
        {...register('fileList', {
          required: 'Please select a file to upload',
          validate: {
            // fileType: value => {
            //   if (value && value[0] && !value[0].type.startsWith('image/')) {
            //     return 'Only image files are allowed'
            //   }
            //   return true
            // },
            fileSize: value => {
              if (value && value[0] && value[0].size > 20 * 1024 * 1024) {
                return 'File size must be less than 20MB'
              }
              return true
            }
          }
        })}
        error={errors.fileList?.message}
      />
      <Button
        onClick={handleSubmit(onSubmit)}
        variant={'destructive'}
        disabled={isPending}
      >
        {isPending ? `Uploading... ${percent}%` : 'Upload File'}
      </Button>
    </form>
  )
}

export default UploadFile
