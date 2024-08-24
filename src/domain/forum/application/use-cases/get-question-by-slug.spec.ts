import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { Slug } from '../../enterprise/entities/value-objects/slug'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug Use Case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(questionsRepository)
  })

  it('should be able to get a question by its slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('example-question'),
    })

    await questionsRepository.create(newQuestion)

    const result = await sut.execute({
      slug: 'example-question',
    })

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
      }),
    })
  })
})
