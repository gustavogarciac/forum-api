import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-anwers-repository'

import { CommentOnAnswerUseCase } from './comment-on-answer'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on answer use case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(
      answersRepository,
      answerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await answersRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-1',
      content: 'Comment content',
    })

    expect(answerCommentsRepository.items[0].content).toEqual('Comment content')
  })
})
