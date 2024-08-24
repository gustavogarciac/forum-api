import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question) {
    this.items.push(question)

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(itemIndex, 1)

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async findBySlug(slug: string) {
    const question = this.items.find((question) => question.slug.value === slug)

    if (!question) return null

    return question
  }

  async findById(id: string) {
    const question = this.items.find(
      (question) => question.id.toString() === id,
    )

    if (!question) return null

    return question
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items[itemIndex] = question

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findManyRecent({ page }: PaginationParams) {
    const sortedQuestions = [...this.items].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    ) // Difference in time between two questions
    // It is using spread operator so that the array of items do not mutate.

    const paginatedQuestions = sortedQuestions.slice((page - 1) * 20, page * 20)

    return paginatedQuestions
  }
}
