import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'

import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  passwordHash: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>
@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerStudentUseCase: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, passwordHash } = body

    const result = await this.registerStudentUseCase.execute({
      name,
      email,
      password: passwordHash,
    })

    if (result.isLeft()) throw new Error()
  }
}
