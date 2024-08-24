import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

import { AuthenticateStudentUseCase } from './authenticate-student'

let studentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(
      studentsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should authenticate a student', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      passwordHash: await fakeHasher.hash('123456'),
    })

    await studentsRepository.create(student)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
