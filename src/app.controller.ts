import { Controller, Get } from '@nestjs/common'

import { AppService } from './app.service'

@Controller() // Controller decorator parameters will be route prefixes for every route in the controller.
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // HTTP method decorator parameters will be route suffixes for the route.
  getHello(): string {
    return this.appService.getHello()
  }
}
