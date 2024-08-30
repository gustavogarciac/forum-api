import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

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

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page, query, perPage }: PaginationParams,
  ) {
    const sortedAnswerComments = [...this.items]
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .filter((comment) => comment.answerId.toString() === answerId)

    const paginatedAnswerComments = sortedAnswerComments.slice(
      (page - 1) * perPage,
      page * perPage,
    )

    const answerCommentsWithAuthor = paginatedAnswerComments.map((comment) => {
      const author = this.studentsRepository.items.find((student) => {
        return student.id.equals(comment.authorId)
      })

      if (!author) {
        throw new Error('Author not found')
      }

      return CommentWithAuthor.create({
        commentId: comment.id,
        authorId: comment.authorId,
        authorName: author.name,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      })
    })

    if (query) {
      return answerCommentsWithAuthor.filter((comment) =>
        comment.content.includes(query),
      )
    }

    return answerCommentsWithAuthor
  }

  async findManyByAnswerId(
    answerId: string,
    { page, perPage }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const sortedAnswerComments = [...this.items]
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .filter((comment) => comment.answerId.toString() === answerId)

    const paginatedAnswerComments = sortedAnswerComments.slice(
      (page - 1) * perPage,
      page * perPage,
    )

    return paginatedAnswerComments
  }
}
