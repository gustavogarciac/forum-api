import { Controller, Get } from '@nestjs/common'

import { AppService } from './app.service'
import { PrismaService } from './prisma/prisma.service'

@Controller() // Controller decorator parameters will be route prefixes for every route in the controller.
export class AppController {
  constructor(
    private appService: AppService,
    private prisma: PrismaService,
  ) {}

  @Get() // HTTP method decorator parameters will be route suffixes for the route.
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('users')
  async getUsers() {
    return await this.prisma.user.findMany()
  }
}
