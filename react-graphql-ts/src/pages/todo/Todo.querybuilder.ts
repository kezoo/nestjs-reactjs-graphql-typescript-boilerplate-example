import { PAGINATION_CONS, } from "../../constants/general.constant"
import { QueryBuilderTypeItem } from "../../graphqlBuilders/_graphqlBuilders.interface"
import { TodoQueryBuilderParams } from "./Todo.interface"

type TodoQueryBuilderTypes = 'list' | 'listWithPage' | 'upTodo' | 'addTodo' | 'removeTodo'


export function TodoQueryBuilder (type: TodoQueryBuilderTypes, params?: TodoQueryBuilderParams) {
  const {id, upCompleted, upTitle, pageOptions} = params || {}
  const {
    limit = PAGINATION_CONS.limit,
    pageNo = 0,
    before = '',
    after = '',
    avoidCursorBased = true,
    sortOrderBy = 'ASC',
    sortingItems = [],
  } = pageOptions || {}
  const types: {
    [type in TodoQueryBuilderTypes]: QueryBuilderTypeItem
  } = {
    list: {
      queryString: `{todos{
        id, title, completed, createdAt, updatedAt,
      }}`
    },
    listWithPage: {
      queryStringFn: () => {
        const str = `{
          todoListWithPagination (
            limit: ${limit},
            pageNo: ${pageNo},
            avoidCursorBased: ${avoidCursorBased},
            before: "${before}",
            after: "${after}",
            sortOrderBy: "${sortOrderBy}",
            sortingItemsStr: "${JSON.stringify(sortingItems).replace(/\"/g, '\\"')}",
          ) {
            nodes {
              id,
              title,
              completed,
              createdAt,
              updatedAt,
            }
            edges {
              node {
                id,
                title,
                completed,
                createdAt,
                updatedAt,
              }
            }
            pageInfo {
              hasPreviousPage,
              hasNextPage,
              countBefore,
              countCurrent,
              countNext,
              countTotal,
              startCursor,
              endCursor,
            }
          }
        }`

        return str
      }
    },
    upTodo: {
      queryStringFn: () => {
        let str = ''
        console.log(`TodoQueryBuilder id `, id)
        const isUpComBool = typeof upCompleted == 'boolean'
        if (id && (isUpComBool || upTitle)) {
          let upType = ""
          if (upTitle) {
            upType = `title: "${upTitle}"`
          }
          if (isUpComBool) {
            upType = `completed: ${upCompleted}`
          }
          str = `{updateTodo(id: "${id}", updateTaskInput: {${upType}}) {
            id, title, completed, createdAt, updatedAt,
          }}`
        }
        console.log(`TodoQueryBuilder str `, str)
        return str
      }
    },
    addTodo: {
      queryString: `{addTodo(title: "${upTitle}"){
        id, title, completed, createdAt, updatedAt,
      }}`
    },
    removeTodo: {
      queryString: `{removeTodo(id: "${id}"){id}}`
    }
  }
  const typeItem = types[type]
  const queryString = typeItem.queryStringFn?.apply(null) || typeItem.queryString || ''
  const res = {
    queryString,
  }
  return res
}
