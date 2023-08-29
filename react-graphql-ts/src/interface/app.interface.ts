import { ApolloClient, NormalizedCacheObject } from "@apollo/client"
import { ObjectAnyProp } from "../pages/todo/Todo.interface"
export type TypeGeneralFunc = (argu?: any) => any

export interface AppConstantProps {
  apolloClient?: ApolloClient<NormalizedCacheObject>,
}

export interface SendGraphqlQueryParams {
  queryType?: SendGraphqlQueryQueryType
  queryString: string
  handleRes?: GraphqlQueryHandleResult
}
export type SendGraphqlQueryQueryType = 'query' | 'mutation'
export type SendGraphqlQueryQueryTypeItems = {
  [type in SendGraphqlQueryQueryType]: SendGraphqlQueryQueryTypeItemProps
}
export interface SendGraphqlQueryQueryTypeItemProps {
  name: SendGraphqlQueryQueryType
  method?: TypeGeneralFunc
}
export type GraphqlQueryHandleResult = (payload: DataForGraphqlQueryHandleResult) => void
export interface DataForGraphqlQueryHandleResult {
  data: ObjectAnyProp
  dataStringOrNumber: string | number | null
  dataBool: boolean | null
  dataList: ObjectAnyProp[]
}
export type SortOrder = 'ASC' | 'DESC'
export interface SortOptions {
  sortByKey: string
  sortDirection: SortOrder
  isDateKey?: boolean
  noMoreDateTypeComparing?: boolean
  null?: string
}
export interface Pagination {
  limit: number
  offset?: number
  pageNo?: number
  avoidCursorBased?: boolean
  sortOrderBy?: SortOrder
  sortingItems?: SortOptions[]
}
export interface PaginationOptional extends Partial<Pagination> {

}
export interface PaginationConstants {
  limit: number
}
