import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'

describe('Fetch recent questions (e2e)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication() // Create a new instance of the application

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    jwt = moduleRef.get<JwtService>(JwtService)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    await Promise.all([
      questionFactory.makePrismaQuestion({
        authorId: user.id,
        title: 'Question 01',
      }),
      questionFactory.makePrismaQuestion({
        authorId: user.id,
        title: 'Question 02',
      }),
    ])

    const result = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ page: 1, per_page: 2 })
      .send()

    expect(result.statusCode).toBe(200)

    expect(result.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({
          title: expect.any(String),
        }),
      ]),
    })

    expect(result.body.questions).toHaveLength(2)

    await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question 03',
    })

    const queryResult = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ query: '03' })
      .send()

    expect(queryResult.statusCode).toBe(200)

    expect(queryResult.body.questions).toHaveLength(1)

    expect(queryResult.body.questions[0]).toEqual(
      expect.objectContaining({
        title: 'Question 03',
      }),
    )
  })
})
