import { useQueryClient } from '@tanstack/react-query'
import { UseTRPCMutationResult } from '@trpc/react-query/shared'
import React, { useState } from 'react'
import { ExternalToast, toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

import { Button } from '../ui/button'

export interface MutationActionButtonProps {
  mutateFn: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => UseTRPCMutationResult<unknown, unknown, any, unknown>
  data?: Record<string, unknown>
  onSuccess?: (data?: unknown) => void
  buttonTitle?: string
  buttonClassName?: string
  title?: string
  description?: string
  successMessage?: string
  successMessageOptions?: ExternalToast
  successMessageShown?: boolean
  errorMessage?: string
}

const MutationActionButton: React.FC<MutationActionButtonProps> = ({
  mutateFn,
  data,
  onSuccess,
  buttonClassName,
  buttonTitle = 'Delete',
  title = 'Delete Item',
  description = 'Are you sure you want to delete this item?',
  successMessage = 'Item deleted successfully',
  successMessageOptions,
  successMessageShown = true,
  errorMessage = 'An error occurred while deleting the item'
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const { mutate, isPending } = mutateFn({
    mutationKey: ['mutation-action-button', data],
    onSuccess: async () => {
      await queryClient.invalidateQueries()
      if (successMessageShown) {
        toast.success(successMessage, successMessageOptions)
      }
      if (onSuccess) {
        onSuccess(data)
      }
      setIsOpen(false)
    },
    onError: () => {
      toast.error(errorMessage)
    }
  })

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={'destructive'}
          disabled={isPending}
          className={buttonClassName}
        >
          {buttonTitle}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutate(data)} disabled={isPending}>
            {isPending ? 'Loading...' : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default MutationActionButton
