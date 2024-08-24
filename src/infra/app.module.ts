import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { CreateAccountController } from './http/controllers/create-account.controller'
import { AuthenticateController } from './http/controllers/authenticate.controller'
import { CreateQuestionController } from './http/controllers/create-question.controller'
import { FetchRecentQuestionsController } from './http/controllers/fetch-recent-questions.controller'
import { PrismaService } from './prisma/prisma.service'
import { HttpModule } from './http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (envObject) => envSchema.parse(envObject),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
