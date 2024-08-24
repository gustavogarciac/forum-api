/* eslint-disable no-useless-escape */
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { z } from 'zod'

import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { QuestionPresenter } from '../presenters/question-presenter'

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
  constructor(
    private fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase,
  ) {}

  @Get()
  async handle(
    @Query(paginationQueryValidationPipe)
    paginationParams: PaginationQueryParamSchema,
  ) {
    const { page, per_page: perPage, query } = paginationParams

    const result = await this.fetchRecentQuestionsUseCase.execute({
      page,
      perPage,
      query,
    })

    if (result.isLeft()) throw new Error()

    const { questions } = result.value

    return { questions: questions.map(QuestionPresenter.toHTTP) }
  }
}
