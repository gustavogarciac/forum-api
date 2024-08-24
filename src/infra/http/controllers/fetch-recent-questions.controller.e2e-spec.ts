import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Fetch recent questions (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication() // Create a new instance of the application

    prisma = moduleRef.get<PrismaService>(PrismaService)

    jwt = moduleRef.get<JwtService>(JwtService)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        passwordHash: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: Array.from({ length: 5 }).map(() => ({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        slug: faker.lorem.slug(),
        authorId: user.id,
      })),
    })

    const result = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ page: 1, per_page: 3 })
      .send()

    expect(result.statusCode).toBe(200)

    expect(result.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({
          title: expect.any(String),
        }),
      ]),
    })

    expect(result.body.questions).toHaveLength(3)

    await prisma.question.create({
      data: {
        title: 'How to create a question?',
        content: faker.lorem.paragraph(),
        slug: faker.lorem.slug(),
        authorId: user.id,
      },
    })

    const queryResult = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ query: 'How to create a question?' })
      .send()

    expect(queryResult.statusCode).toBe(200)

    expect(queryResult.body.questions).toHaveLength(1)

    expect(queryResult.body.questions[0]).toEqual(
      expect.objectContaining({
        title: 'How to create a question?',
      }),
    )
  })
})
