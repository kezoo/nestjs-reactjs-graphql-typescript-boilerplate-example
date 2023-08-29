import { GraphQLError } from "graphql"
import { ObjectAnyProp } from "../interfaces/App.interface"

export interface HttpResponseWrapperParams {
  data?: any
  errMsg?: string
  errObj?: ObjectAnyProp
  errMsgPath?: string[]
  useErrCode?: string | number
  graphqlErrors?: GraphQLError[]
}
