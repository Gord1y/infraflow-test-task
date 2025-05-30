import { Kafka, Partitioners } from 'kafkajs'
import dotenv from 'dotenv'
dotenv.config()

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'default-client',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
})

export const producer = kafka.producer({
  // you can also tune retry here if you want:
  // retry: { retries: 5, initialRetryTime: 300 }
})

export const TOPIC = (process.env.KAFKA_TOPIC || 'default-topic').trim()

export async function ensureTopicExists(maxRetries = 5, retryDelayMs = 2000): Promise<void> {
  const admin = kafka.admin()
  await admin.connect()

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const topics = await admin.listTopics()
      console.log(`Attempt ${attempt}: Checking if topic "${TOPIC}" exists...`)
      if (topics.includes(TOPIC)) {
        // Topic already exists
        const metadata = await admin.fetchTopicMetadata({ topics: [TOPIC] })
        const hasLeader = metadata.topics.some((t) => t.name === TOPIC && t.partitions.some((p) => p.leader !== -1))
        if (hasLeader) {
          await admin.disconnect()
          return
        }
      }

      await admin.createTopics({
        waitForLeaders: true,
        topics: [{ topic: TOPIC, numPartitions: 1, replicationFactor: 1 }]
      })
      // success or already exists with leader
      await admin.disconnect()
      return
    } catch (err) {
      if (attempt === maxRetries) {
        await admin.disconnect()
        throw err
      }
      // wait and retry
      await new Promise((r) => setTimeout(r, retryDelayMs))
    }
  }
}
