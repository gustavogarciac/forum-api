import { Injectable } from '@nestjs/common'

import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Student): Promise<void> {
    const student = PrismaStudentMapper.toPersistence(data)

    await this.prisma.user.create({
      data: student,
    })
  }

  async findByEmail(email: string): Promise<Student | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) return null

    return PrismaStudentMapper.toDomain(user)
  }
}
