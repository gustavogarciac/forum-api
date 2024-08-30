/* eslint-disable no-useless-escape */
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'

import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter'

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

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerCommentsUseCase: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query(paginationQueryValidationPipe)
    paginationParams: PaginationQueryParamSchema,
    @Param('answerId') answerId: string,
  ) {
    const { page, per_page: perPage, query } = paginationParams

    const result = await this.fetchAnswerCommentsUseCase.execute({
      page,
      perPage,
      query,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { comments } = result.value

    return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) }
  }
}
