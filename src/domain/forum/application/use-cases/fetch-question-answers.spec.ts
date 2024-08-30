import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-anwers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(answersRepository)
  })

  it('should be able to fetch question answers', async () => {
    await answersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-01') }),
    )
    await answersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-01') }),
    )
    await answersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-01') }),
    )

    const result = await sut.execute({
      page: 1,
      perPage: 20,
      questionId: 'question-01',
    })

    expect(result.value?.answers).toHaveLength(3)
  })

  it('should paginate fetched question answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await answersRepository.create(
        makeAnswer({ questionId: new UniqueEntityId('question-01') }),
      )
    }

    const result = await sut.execute({
      page: 2,
      perPage: 20,
      questionId: 'question-01',
    })

    expect(result.value?.answers).toHaveLength(2)
  })
})
