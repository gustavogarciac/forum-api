import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'
import { QuestionsCommentsRepository } from '../repositories/question-comments-repository'

interface FetchQuestionCommentsUseCaseRequest {
  page: number
  perPage: number
  query?: string
  questionId: string
}

type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(
    private questionCommentsRepository: QuestionsCommentsRepository,
  ) {}

  async execute({
    page,
    perPage,
    query,
    questionId,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const comments =
      await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(
        questionId,
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
