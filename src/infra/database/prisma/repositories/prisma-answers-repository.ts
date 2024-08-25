import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    })

    if (!answer) return null

    return PrismaAnswerMapper.toDomain(answer)
  }

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistence(answer)

    await this.prisma.answer.create({
      data,
    })
  }

  async delete(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistence(answer)

    await this.prisma.answer.delete({
      where: {
        id: data.id,
      },
    })
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistence(answer)

    await this.prisma.answer.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async findManyByQuestionId(
    questionId: string,
    { page, perPage }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }
}
