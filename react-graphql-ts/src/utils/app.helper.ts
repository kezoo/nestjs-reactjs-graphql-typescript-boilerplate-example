import { ApolloClient, InMemoryCache, gql } from "@apollo/client"
import { getApiConf } from "../config/api.config"
import { APP_CONS } from "../constants/general.constant"
import { DataForGraphqlQueryHandleResult, SendGraphqlQueryParams, SendGraphqlQueryQueryTypeItems } from "../interface/app.interface"
import { ObjectAnyProp } from "../pages/todo/Todo.interface"

export function initApolloClient () {
  const client = APP_CONS.apolloClient = new ApolloClient({
    uri: getApiConf({}).mainApiHost + '/graphql',
    cache: new InMemoryCache(),
  });
  return client
}

export function sendGraphqlQuery (params: SendGraphqlQueryParams) {
  const {
    queryType = 'query', queryString, handleRes,
  } = params
  const queryTypeItems: SendGraphqlQueryQueryTypeItems = {
    query: {
      name: 'query',
      method: APP_CONS.apolloClient?.query,
    },
    mutation: {
      name: 'mutation',
      method: APP_CONS.apolloClient?.mutate,
    }
  }
  const queryTypeItem = queryTypeItems[queryType]

  if (!queryString) {
    console.warn(`QueryString is required, queryType: ${queryType}`)
  }
  if (queryTypeItem.method && queryString) {
    const finalQueryStr = `${queryTypeItem.name} ${queryString}`
    console.log(`sendGraphqlQuery finalQueryStr ${finalQueryStr}`)
    queryTypeItem.method({
      [queryTypeItem.name]: gql`${finalQueryStr}`
    })
      .then((res: ObjectAnyProp) => {
        console.log(`sendGraphqlQuery `, res)
        const rRes: DataForGraphqlQueryHandleResult = {
          data: {},
          dataStringOrNumber: null,
          dataBool: null,
          dataList: [],
        }

        if (handleRes && typeof res.data !== 'undefined') {
          if (typeof res.data === 'string' || typeof res.data === 'number') {
            rRes.dataStringOrNumber = res.data
          }
          const isArray = Array.isArray(res.data)
          if (isArray) {
            rRes.dataList = res.data
          }

          if (!isArray && typeof res.data === 'object') {
            rRes.data = res.data
          }

          handleRes(rRes)
        }
      })
  }
}

