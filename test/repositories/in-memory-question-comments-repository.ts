import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryQuestionCommentsRepository
  implements QuestionsCommentsRepository
{
  public items: QuestionComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {} // When need to use a repository inside another in memory repository, do not use the contract, but the concrete class.

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async findById(id: string) {
    const questionComment = this.items.find((item) => item.id.toString() === id)

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )

    this.items.splice(itemIndex, 1)
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionCommentsSorted = [...this.items].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    )

    const questionCommentsPaginated = questionCommentsSorted.slice(
      (page - 1) * 20,
      page * 20,
    )

    return questionCommentsPaginated
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page, perPage, query }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const questionCommentsSorted = [...this.items].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    )

    const questionCommentsPaginated = questionCommentsSorted.slice(
      (page - 1) * perPage,
      page * perPage,
    )

    const questionCommentsWithAuthor = questionCommentsPaginated.map(
      (comment) => {
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
      },
    )

    if (query) {
      return questionCommentsWithAuthor.filter((comment) =>
        comment.content.includes(query),
      )
    }

    return questionCommentsWithAuthor
  }
}
