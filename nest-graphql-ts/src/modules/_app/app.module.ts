import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { join } from 'path'
import loadORM from '../../config/orm.config'
import { ResultMiddleware } from '../../middlewares/result.middleware'
import { HandleGraphqlResponsePlugin } from '../../plugins/HandleGraphqlResponse.plugin'
import { TodoModule } from '../todo/todo.module'
import { AppController } from './app.controller'
import { AppResolver } from './app.resolver'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
      load: [loadORM],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return config.getOrThrow('orm');
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      /* transformSchema: schema => upperDirectiveTransformer(schema, 'upper'),
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      }, */
    }),
    TodoModule,
  ],

  controllers: [
    AppController,
  ],

  providers: [
    AppService,
    AppResolver,
    HandleGraphqlResponsePlugin,
  ],

})



export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      ResultMiddleware,
    ).forRoutes('*');
  }
}
