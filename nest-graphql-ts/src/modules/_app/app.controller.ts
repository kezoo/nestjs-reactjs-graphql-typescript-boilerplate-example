import { Controller, Get } from "@nestjs/common"
import { AppResolver } from "./app.resolver"


@Controller()
export class AppController {
  constructor(private readonly appService: AppResolver) {}

  @Get()
  getHello(): string {
    return this.appService.sayHello()
  }
}
