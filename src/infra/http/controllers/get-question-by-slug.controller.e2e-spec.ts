import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Get question by slug (e2e)', () => {
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

  test('[GET] /questions/:slug', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        passwordHash: '123456',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    await prisma.question.create({
      data: {
        title: 'How to create a question?',
        slug: 'how-to-create-a-question',
        content: faker.lorem.paragraph(),
        authorId: user.id,
      },
    })

    const result = await request(app.getHttpServer())
      .get('/questions/how-to-create-a-question')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ page: 1, per_page: 20 })
      .send()

    expect(result.statusCode).toBe(200)

    expect(result.body).toEqual({
      question: expect.objectContaining({ title: 'How to create a question?' }),
    })
  })
})
