import { Injectable } from '@nestjs/common'

@Injectable() // This decorator means that other files may create dependency on this class
export class AppService {
  getHello(): string {
    return 'Hello World!'
  }
}
