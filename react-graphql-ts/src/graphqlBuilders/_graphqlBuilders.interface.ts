export interface QueryBuilderCommonParams {
}
export interface QueryBuilderTypeItem {
  queryString?: string
  queryStringFn?: QueryBuilderQueryStringFn
}
export type QueryBuilderQueryStringFn = (p?: QueryBuilderQueryStringFnParams) => string
export interface QueryBuilderQueryStringFnParams {

}
