import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments Use Case', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    await questionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-01') }),
    )
    await questionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-01') }),
    )
    await questionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-01') }),
    )

    const result = await sut.execute({
      page: 1,
      questionId: 'question-01',
    })

    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should paginate fetched question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await questionCommentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityId('question-01') }),
      )
    }

    const result = await sut.execute({
      page: 2,
      questionId: 'question-01',
    })

    expect(result.value?.questionComments).toHaveLength(2)
  })
})
