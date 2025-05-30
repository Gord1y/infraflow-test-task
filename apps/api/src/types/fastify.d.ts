import '@fastify/multipart'
import { MultipartFile } from '@fastify/multipart'

declare module 'fastify' {
  interface FastifyRequest {
    parts: () => AsyncIterableIterator<MultipartFile | { type: 'field'; fieldname: string; value: string }>
  }
}
