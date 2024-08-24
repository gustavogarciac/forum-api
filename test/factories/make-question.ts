import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId,
) {
  const title = faker.lorem.sentence()
  const slug = Slug.create(title)

  const newQuestion = Question.create(
    {
      title,
      slug,
      content: faker.lorem.text(),
      authorId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return newQuestion
}
