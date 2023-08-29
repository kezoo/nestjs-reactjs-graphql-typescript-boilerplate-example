import { ArgsType, Field, InputType, Int } from '@nestjs/graphql'
import { Knex } from 'knex'


@InputType('PaginationSorting')
export class PaginationSorting {

  @Field(() => String, { nullable: true })
  sortByKey: string;

  @Field(() => String, { nullable: true })
  sortDirection?: string;

  @Field(() => Boolean, { nullable: true })
  isDateKey?: boolean

  @Field(() => Boolean, { nullable: true })
  noMoreDateTypeComparing?: boolean

  @Field(() => String, { nullable: true })
  null?: string;
}

@ArgsType()
export class PaginationArgs<T> {

    @Field(() => Int, { nullable: true })
    limit: number;

    @Field(() => Int, { nullable: true })
    pageNo: number;

    @Field(() => Boolean, { nullable: true })
    avoidCursorBased: boolean;

    @Field(() => String, { nullable: true })
    after: string;

    @Field(() => String, { nullable: true })
    before: string;

    @Field(() => String, { nullable: true })
    sortOrderBy: string;

    @Field(() => String, { nullable: true })
    sortingItemsStr: string;

    @Field(() => [PaginationSorting], { nullable: true })
    sortingItems: PaginationSorting[];

}

export interface PaginationExtraArgs<T> {

  mainTableName: string

  mainIdName?: string

  pageSize?: number;

  addDateProps?: string[]

  filterQuery?: PaginationFilterQuery

  transformPageList?: PaginationTransformPageList<T>
}

export type PaginationTransformPageList<T> = (list: T[]) => void

export type PaginationFilterQuery = (params: PaginationFilterQueryParams) => void
export interface PaginationFilterQueryParams {
  qBuilder: Knex.QueryBuilder
}
