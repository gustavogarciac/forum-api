import { Either, left, right } from './either'

function doSomething(foo: boolean): Either<string, number> {
  if (foo) return right(10)
  return left('error')
}

test('success result', () => {
  const result = doSomething(true)

  expect(result.isRight()).toBeTruthy()
  expect(result.isLeft()).toBeFalsy()
})

test('error result', () => {
  const result = doSomething(false)

  expect(result.isRight()).toBeFalsy()
  expect(result.isLeft()).toBeTruthy()
})
