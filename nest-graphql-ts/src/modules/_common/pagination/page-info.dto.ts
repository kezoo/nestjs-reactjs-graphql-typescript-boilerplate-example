import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PageInfo {
  @Field({ nullable: true })
  startCursor: string;

  @Field({ nullable: true })
  endCursor: string;

  @Field()
  hasPreviousPage: boolean;

  @Field()
  hasNextPage: boolean;

  @Field()
  countBefore: number;

  @Field()
  countNext: number;

  @Field()
  countCurrent: number;

  @Field()
  countTotal: number;
}
