
import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server'
import { Plugin } from '@nestjs/apollo'
import { GraphQLError } from 'graphql'
import { ObjectAnyProp } from '../interfaces/App.interface'
import { isObject } from '../utils'
import { httpResponseWrapper } from '../utils/http.util'

@Plugin()
export class HandleGraphqlResponsePlugin implements ApolloServerPlugin {
  async requestDidStart(): Promise<GraphQLRequestListener<any>> {
    // console.log('HandleResponsePlugin Request started');
    return {
      /* async responseForOperation(requestContext) {
        const res = requestContext.response as GraphQLResponse
        return res
      }, */
      /* async didEncounterErrors (requestContext) {

      }, */
      async willSendResponse(requestContext) {
        const res: ObjectAnyProp = requestContext.response
        const resData = isObject(res.data) ? res.data : {}
        const keys = Object.keys(resData)

        for (const tKey of keys) {
          const shouldSkip = ['__schema'].includes(tKey)

          if (shouldSkip) {
            continue
          }

          const oData = resData[tKey] ?? null
          // console.log(`^^^^^^^^^^^ willSendResponse key ${tKey} DATA `, oData)
          resData[tKey] = httpResponseWrapper({
            data: oData,
          })
        }

        if (requestContext.errors) {
          res.data = httpResponseWrapper({
            graphqlErrors: requestContext.errors as GraphQLError[],
          })
          delete res.errors
        }
      },
    };
  }
}
