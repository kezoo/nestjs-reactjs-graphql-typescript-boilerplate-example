import { Query, Resolver } from "@nestjs/graphql"

@Resolver()
export class AppResolver {

  @Query(returns => String)
  sayHello(): string {
    return 'Hello World!';
  }
}
