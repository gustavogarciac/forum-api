import { z } from 'zod'

export const envSchema = z.object({
  NEST_CLEAN_DATABASE_PORT: z.coerce.number().default(5432),
  NEST_CLEAN_DATABASE_USER: z.string(),
  NEST_CLEAN_DATABASE_PASSWORD: z.string(),
  NEST_CLEAN_DATABASE_NAME: z.string(),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().optional().default(3333),
})

export type Env = z.infer<typeof envSchema>
