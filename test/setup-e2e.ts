import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { Redis } from 'ioredis'

import { DomainEvents } from '@/core/events/domain-events'
import { envSchema } from '@/infra/env/env'

config({
  path: './env',
  override: true,
})

config({
  path: './env.test',
  override: true,
})

const env = envSchema.parse(process.env)

const prisma = new PrismaClient()
const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
})

/**
 * This function generates a unique database URL for each e2e test run. It receives a random or specific schema ID and returns a database URL
 * with the schema parameter set to the schema ID.
 * @param schemaId - The schema ID to use in the database URL.
 * @returns The database URL with the schema parameter set to the schema ID.
 * @throws If the DATABASE_URL environment variable is not set.
 * @example
 * ```ts
 * const databaseURL = generateUniqueDatabaseURL(randomUUID())
 * ```
 * **/
function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId) // Change public to a unique schema

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseURL

  DomainEvents.shouldRun = false

  await redis.flushdb()

  execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
