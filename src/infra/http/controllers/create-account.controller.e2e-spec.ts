import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'

describe('Create account (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication() // Create a new instance of the application

    prisma = moduleRef.get<PrismaService>(PrismaService)

    await app.init()
  })

  test('[POST] /accounts', async () => {
    const result = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: '123456',
    })

    expect(result.statusCode).toBe(201)

    const userIsSavedOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    })

    expect(userIsSavedOnDatabase).toBeTruthy()
  })
})
