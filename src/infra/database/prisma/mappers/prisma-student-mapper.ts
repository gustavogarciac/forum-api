import { Prisma, User as PrismaStudent } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class PrismaStudentMapper {
  static toDomain(raw: PrismaStudent): Student {
    return Student.create(
      {
        email: raw.email,
        name: raw.name,
        passwordHash: raw.passwordHash,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPersistence(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      email: student.email,
      name: student.name,
      passwordHash: student.passwordHash,
    }
  }
}
