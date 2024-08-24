/* eslint-disable no-useless-escape */
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { z } from 'zod'

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/prisma/prisma.service'

const paginationQueryParamSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
  per_page: z
    .string()
    .optional()
    .default('20')
    .transform(Number)
    .pipe(z.number().min(1)),
  query: z.string().optional().default(''),
})

type PaginationQueryParamSchema = z.infer<typeof paginationQueryParamSchema>

const paginationQueryValidationPipe = new ZodValidationPipe(
  paginationQueryParamSchema,
)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(
    @Query(paginationQueryValidationPipe)
    paginationParams: PaginationQueryParamSchema,
  ) {
    const { page, per_page: perPage, query } = paginationParams

    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (page - 1) * perPage,
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    })

    return { questions }
  }
}
