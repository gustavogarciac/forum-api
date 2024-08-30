import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let studentsRepository: InMemoryStudentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete question comment use case', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    questionCommentsRepository = new InMemoryQuestionCommentsRepository(
      studentsRepository,
    )
    sut = new DeleteQuestionCommentUseCase(questionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await questionCommentsRepository.create(questionComment)

    await sut.execute({
      authorId: 'author-1',
      questionCommentId: questionComment.id.toString(),
    })

    expect(questionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question comment if the author is not the same', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await questionCommentsRepository.create(questionComment)

    const result = await sut.execute({
      authorId: 'author-2',
      questionCommentId: questionComment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
