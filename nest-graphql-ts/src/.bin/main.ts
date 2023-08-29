require('../lib/initEnvAndConfig')

import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
// import * as helmet from 'helmet'
import { HttpExceptionFilter } from '../filters/http-exception.filter'
import { TransformInterceptor } from '../interceptors/transform.interceptor'
import { ConfigType } from '../interfaces/App.interface'
import { initKnex } from '../lib/knex'
import { AppModule } from '../modules/_app/app.module'

class App {
  constructor() {
    this.run()
  }

  config: ConfigType = require('config')

  async run(): Promise<void> {
    Logger.log(`AppConfig `, JSON.stringify(this.config))

    await initKnex()

    const port = this.config.server.port || 3000
    const app = await NestFactory.create(AppModule)
    // app.use(helmet())
    app
      .useGlobalFilters(
        new HttpExceptionFilter(),
      )
      .useGlobalInterceptors(
        new TransformInterceptor(),
      )
      .useGlobalPipes(
        new ValidationPipe({
          skipMissingProperties: true,
        }),
      )
    await app.listen(port)
    Logger.log(`Server started on http://localhost:${port}/graphql`, 'Server')
  }
}

new App()
