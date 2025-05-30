import { initTRPC } from '@trpc/server'
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { deleteFileSchema, nameSchema, querySchema, updateFileSchema } from './schemas'
import { BUCKET, REGION, s3 } from './services/s3'
import { prisma } from './services/prisma'
import { producer, TOPIC } from './services/kafka'

export const createContext = ({ req, res }: CreateFastifyContextOptions) => ({ req, res })
const t = initTRPC.context<typeof createContext>().create()

const appRouter = t.router({
  status: t.procedure.query(() => {
    return {
      status: 'ok',
      message: 'Hello, world!'
    }
  }),
  getFiles: t.procedure.input(querySchema).query(async ({ input }) => {
    const [result, total] = await Promise.all([
      prisma.file.findMany({
        skip: (input.page - 1) * input.perPage,
        take: input.perPage,
        orderBy: { [input.sortBy]: input.sortOrder },
        where: {
          OR: [
            { name: { contains: input.search, mode: 'insensitive' } },
            { contentType: { contains: input.search, mode: 'insensitive' } },
            { key: { contains: input.search, mode: 'insensitive' } },
            { url: { contains: input.search, mode: 'insensitive' } },
            { bucket: { contains: input.search, mode: 'insensitive' } },
            { region: { contains: input.search, mode: 'insensitive' } }
          ]
        }
      }),
      prisma.file.count()
    ])
    return {
      result,
      pagination: {
        total,
        page: input.page,
        perPage: input.perPage,
        totalPages: Math.ceil(total / input.perPage),
        nextPage: input.page * input.perPage < total ? input.page + 1 : null
      }
    }
  }),
  uploadFile: t.procedure.mutation(async ({ ctx }) => {
    const req = ctx.req

    const parts = req.parts()
    let name = ''
    let fileData: Buffer | null = null
    let fileName = ''
    let contentType = ''
    let size = 0

    for await (const part of parts) {
      if (part.type === 'file') {
        fileName = part.filename!
        contentType = part.mimetype!
        size = 0

        const chunks: Buffer[] = []
        for await (const chunk of part.file) {
          chunks.push(chunk)
          size += chunk.length
        }
        fileData = Buffer.concat(chunks)
      } else if (part.type === 'field' && part.fieldname === 'name') {
        name = part.value as string
      }
    }

    const parsedName = nameSchema.safeParse(name)
    if (!parsedName.success) {
      throw new Error(parsedName.error.format()._errors.join(', '))
    }

    if (!fileData || !fileName || !contentType) {
      throw new Error('Invalid form submission')
    }

    const key = `${Date.now()}-${fileName}`

    const bucketExists = await s3.bucketExists(BUCKET)
    if (!bucketExists) {
      await s3.makeBucket(BUCKET, REGION)
    }

    await s3.putObject(BUCKET, key, fileData, size, {
      'Content-Type': contentType
    })

    const fileUrl = `${BUCKET}/${key}`

    const file = await prisma.file.create({
      data: {
        name,
        size,
        contentType,
        key,
        url: fileUrl,
        bucket: BUCKET,
        region: REGION
      }
    })

    try {
      await producer.send({
        topic: TOPIC,
        messages: [{ value: JSON.stringify({ event: 'file_uploaded', fileId: file.id }) }]
      })
      console.log(`File upload event sent for file ID: ${file.id}`)
    } catch (error) {
      console.error(`Failed to send file upload event for file ID: ${file.id}`, error)
    }

    return {
      message: `File uploaded`,
      file
    }
  }),
  updateFile: t.procedure.input(updateFileSchema).mutation(async ({ input }) => {
    const file = await prisma.file.findUniqueOrThrow({ where: { id: input.id } })

    const updatedFile = await prisma.file.update({
      where: { id: file.id },
      data: { name: input.name }
    })

    await producer.send({
      topic: TOPIC,
      messages: [{ value: JSON.stringify({ event: 'file_updated', fileId: updatedFile.id }) }]
    })

    return {
      message: `File ${file.name} updated successfully`,
      file: updatedFile
    }
  }),
  deleteFile: t.procedure.input(deleteFileSchema).mutation(async ({ input }) => {
    const file = await prisma.file.findUniqueOrThrow({ where: { id: input.id } })

    await s3.removeObject(BUCKET, file.key)

    await prisma.file.delete({ where: { id: input.id } })

    return {
      message: `File ${file.name} deleted successfully`,
      fileId: input.id
    }
  })
})

export default appRouter

export type AppRouter = typeof appRouter
