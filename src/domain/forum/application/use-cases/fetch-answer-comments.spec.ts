import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let studentsRepository: InMemoryStudentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments Use Case', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    answerCommentsRepository = new InMemoryAnswerCommentsRepository(
      studentsRepository,
    )
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to fetch question answers', async () => {
    const student = makeStudent({ name: 'John Doe' })

    studentsRepository.items.push(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-01'),
      authorId: student.id,
    })
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-01'),
      authorId: student.id,
    })
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityId('answer-01'),
      authorId: student.id,
    })

    await answerCommentsRepository.create(comment1)
    await answerCommentsRepository.create(comment2)
    await answerCommentsRepository.create(comment3)

    const result = await sut.execute({
      page: 1,
      perPage: 20,
      answerId: 'answer-01',
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authorName: 'John Doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          authorName: 'John Doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          authorName: 'John Doe',
          commentId: comment3.id,
        }),
      ]),
    )
  })

  it('should paginate fetched answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    studentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await answerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-01'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      perPage: 20,
      answerId: 'answer-01',
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
