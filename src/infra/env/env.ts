import { z } from 'zod'

export const envSchema = z.object({
  NEST_CLEAN_DATABASE_PORT: z.coerce.number().default(5432),
  NEST_CLEAN_DATABASE_USER: z.string(),
  NEST_CLEAN_DATABASE_PASSWORD: z.string(),
  NEST_CLEAN_DATABASE_NAME: z.string(),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_BUCKET_NAME: z.string(),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  REDIS_HOST: z.string().optional().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_DB: z.coerce.number().default(0),
})

export type Env = z.infer<typeof envSchema>
