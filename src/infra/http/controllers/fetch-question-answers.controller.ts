/* eslint-disable no-useless-escape */
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'

import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { AnswerPresenter } from '../presenters/answer-presenter'

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

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(
    private fetchQuestionAnswersUseCase: FetchQuestionAnswersUseCase,
  ) {}

  @Get()
  async handle(
    @Query(paginationQueryValidationPipe)
    paginationParams: PaginationQueryParamSchema,
    @Param('questionId') questionId: string,
  ) {
    const { page, per_page: perPage, query } = paginationParams

    const result = await this.fetchQuestionAnswersUseCase.execute({
      page,
      perPage,
      query,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { answers } = result.value

    return { answers: answers.map(AnswerPresenter.toHTTP) }
  }
}
