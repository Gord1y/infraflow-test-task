import { Client } from 'minio'
import dotenv from 'dotenv'

dotenv.config()

export const s3 = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: Number(process.env.MINIO_PORT || 9000),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
})

export const BUCKET = process.env.MINIO_BUCKET || 'files'
export const REGION = process.env.MINIO_REGION || 'eu-east-1'
