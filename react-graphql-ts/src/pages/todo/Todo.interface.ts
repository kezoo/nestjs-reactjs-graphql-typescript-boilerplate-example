import { InputRef } from "antd"
import { Pagination, PaginationOptional, SortOptions } from "../../interface/app.interface"

export interface TodoPageState {
  input: string
  listWidth: number
  upState: number
  sort: TodoPageSort
  page: Pagination
  totalTodos: number
}
export type TodoPageSort = SortOptions | null
export interface TodoItem {
  id?: string
  title: string
  titleChanged?: string
  completed?: boolean,
  createdAt?: string
  updatedAt?: string
  editable?: boolean
}
export interface ReqTodoListParams {
  doReset?: boolean
  sort?: TodoPageSort
}
export interface TodoPageRef {
  current: {
    itemsRefs: {
      [key: string]: InputRef
    }
  }
}
export interface TodoQueryBuilderParams {
  id?: string
  upTitle?: string
  upCompleted?: boolean
  pageOptions?: TodoListPageOptions
}
export interface TodoListPageOptions extends PaginationOptional {
  before?: string
  after?: string

}
export interface ObjectAnyProp {
  [key: string]: any
}
