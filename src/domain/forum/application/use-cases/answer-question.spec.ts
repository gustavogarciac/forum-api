import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-anwers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AnswerQuestionUseCase } from './answer-question'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
    sut = new AnswerQuestionUseCase(answersRepository)
  })

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      content: 'New answer',
      instructorId: '1',
      questionId: '1',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(answersRepository.items[0]).toEqual(result.value?.answer)
    expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(answersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ])
  })
})
