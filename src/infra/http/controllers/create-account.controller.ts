import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error'
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

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
