import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )

    this.items.splice(itemIndex, 1)
  }

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id)

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const sortedAnswerComments = [...this.items].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    )

    const paginatedAnswerComments = sortedAnswerComments.slice(
      (page - 1) * 20,
      page * 20,
    )

    return paginatedAnswerComments
  }
}
