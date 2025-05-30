import { s3, BUCKET } from '../services/s3'
import { prisma } from '../services/prisma'

export async function cleanupOrphans() {
  if (!(await s3.bucketExists(BUCKET))) {
    console.warn(`Bucket ${BUCKET} does not exist, skipping cleanup`)
    return
  }

  console.log('🧹 Doing cleanup...')
  const listed = await new Promise<string[]>((resolve, reject) => {
    const keys: string[] = []
    // check if the bucket exists on S3

    s3.listObjects(BUCKET, '', true)
      .on('data', (obj) => {
        if (obj.name) {
          keys.push(obj.name)
        } else {
          console.warn('Received object without key:', obj)
        }
      })
      .on('end', () => resolve(keys))
      .on('error', reject)
  })

  const records = await prisma.file.findMany({ select: { key: true } })
  const existing = new Set(records.map((r) => r.key))

  for (const key of listed) {
    if (!existing.has(key)) {
      await s3.removeObject(BUCKET, key)
      console.log(`Removed orphaned object: ${key}`)
    }
  }
}
