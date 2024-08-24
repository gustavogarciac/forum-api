import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments Use Case', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to fetch question answers', async () => {
    await answerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-01') }),
    )
    await answerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-01') }),
    )
    await answerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-01') }),
    )

    const result = await sut.execute({
      page: 1,
      answerId: 'answer-01',
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should paginate fetched answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await answerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityId('answer-01') }),
      )
    }

    const result = await sut.execute({
      page: 2,
      answerId: 'answer-01',
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
