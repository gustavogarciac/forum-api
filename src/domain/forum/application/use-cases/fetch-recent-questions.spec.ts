import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let attachmentsRepository: InMemoryAttachmentsRepository
let studentsRepository: InMemoryStudentsRepository
let questionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions By Slug Use Case', () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentsRepository()
    studentsRepository = new InMemoryStudentsRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
      attachmentsRepository,
      studentsRepository,
    )
    sut = new FetchRecentQuestionsUseCase(questionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 20) }),
    )
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 18) }),
    )
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 23) }),
    )

    const result = await sut.execute({ page: 1, perPage: 3 })

    expect(result.value?.questions).toHaveLength(3)
  })

  it('should sort by date when fetching recent questions', async () => {
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 20) }),
    )
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 18) }),
    )
    await questionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 23) }),
    )

    const result = await sut.execute({ page: 1, perPage: 3 })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 18) }),
    ])
  })

  it('should paginate when fetching recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await questionsRepository.create(makeQuestion())
    }

    const result = await sut.execute({ page: 1, perPage: 20 })
    const secondResult = await sut.execute({ page: 2, perPage: 20 })

    expect(result.value?.questions).toHaveLength(20)
    expect(secondResult.value?.questions).toHaveLength(2)
  })

  it('should be able to fetch recent questions with query', async () => {
    await questionsRepository.create(makeQuestion({ title: 'Question 1' }))
    await questionsRepository.create(makeQuestion({ title: 'Question 2' }))
    await questionsRepository.create(makeQuestion({ title: 'Question 3' }))

    const result = await sut.execute({
      page: 1,
      perPage: 3,
      query: 'question 2',
    })

    expect(result.value?.questions).toHaveLength(1)
    expect(result.value?.questions[0].title).toBe('Question 2')
  })
})
