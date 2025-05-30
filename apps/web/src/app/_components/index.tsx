'use client'

import { DataTable } from '@/components/ui/data-table'

import { columns } from './columns'
import UploadFileForm from './upload-file'
import { trpc } from '@/lib/trpc-client'

const HomeComponent: React.FC = () => {
  return (
    <>
      <DataTable fetchFn={trpc.getFiles.useQuery} columns={columns} />
      <div className='mx-auto flex w-full flex-col gap-2 md:gap-4 lg:flex-row'>
        <UploadFileForm />
      </div>
    </>
  )
}

export default HomeComponent
