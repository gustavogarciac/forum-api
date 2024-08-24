import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['warn', 'error'],
    }) // Call the constructor of the PrismaClient class.
  }

  onModuleDestroy() {
    return this.$disconnect() // Disconnect the PrismaClient client when the module is destroyed.
  }

  onModuleInit() {
    return this.$connect() // Connect the PrismaClient client when the module is initialized.
  }
}
