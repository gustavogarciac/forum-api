import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface FetchAnswerCommentsUseCaseRequest {
  page: number
  perPage: number
  query?: string
  answerId: string
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    page,
    perPage,
    query,
    answerId,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const comments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
          perPage,
          query,
        },
      )

    return right({
      comments,
    })
  }
}
