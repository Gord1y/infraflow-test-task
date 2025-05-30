import 'dotenv/config'
import * as trpcFastify from '@trpc/server/adapters/fastify'
import fastify, { FastifyBaseLogger, FastifyInstance, FastifyTypeProviderDefault } from 'fastify'
import { IncomingMessage, Server, ServerResponse } from 'http'
import cron, { ScheduledTask } from 'node-cron'
import appRouter, { createContext } from './router'
import fastifyMultipart from '@fastify/multipart'
import fastifyCors from '@fastify/cors'
import { cleanupOrphans } from './cronjobs/cleanup'
import { ensureTopicExists, producer, TOPIC } from './services/kafka'

const server: FastifyInstance<
  Server<typeof IncomingMessage, typeof ServerResponse>,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  FastifyBaseLogger,
  FastifyTypeProviderDefault
> = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname'
      }
    }
  }
})

server.register(fastifyCors, { origin: true })

server.register(fastifyMultipart, {
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
})

server.get('/', async (request, reply) => {
  return reply.send({
    status: 'ok',
    message: 'Hello, world!'
  })
})

server.register(trpcFastify.fastifyTRPCPlugin, {
  prefix: '/api/v1',
  trpcOptions: { router: appRouter, createContext }
})

process.on('unhandledRejection', (reason) => {
  server.log.error({ reason }, 'Unhandled Rejection')
})

process.on('uncaughtException', (err) => {
  server.log.error({ err }, 'Uncaught Exception')
  process.exit(1)
})

let cleanupTask: ScheduledTask

async function shutdown() {
  server.log.info('🔌 Graceful shutdown initiated')

  await server.close()
  server.log.info('🛑 HTTP server closed')

  if (cleanupTask) {
    cleanupTask.stop()
    server.log.info('🧹 Cron jobs stopped')
  }

  try {
    await producer.disconnect()
    server.log.info('🔌 Kafka producer disconnected')
  } catch (err) {
    server.log.error({ err }, 'Error disconnecting Kafka producer')
  }

  process.exit(1)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

async function start() {
  try {
    const didCreate = await ensureTopicExists()
    server.log.info({ didCreate }, `✅ Ensured topic “${TOPIC}” exists`)

    await producer.connect()
    server.log.info('✅ Kafka producer connected')

    cleanupTask = cron.schedule('*/1 * * * *', cleanupOrphans)
    server.log.info('🧹 Scheduled cleanup every minute')

    const port = Number(process.env.PORT || 4000)
    await server.listen({ port, host: '0.0.0.0' })
  } catch (err) {
    server.log.error({ err }, '❌ Failed to start server')
    process.exit(1)
  }
}

start()

export default server
