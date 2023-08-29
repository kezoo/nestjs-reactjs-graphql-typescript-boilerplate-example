import { ObjectAnyProp } from "./App.interface"

export interface HttpResponse {
  data?: HttpResponseData
  code: HttpResponseCode
  message: string
  status: number
  altCode?: HttpResponseCode
  extraMsg?: HttpResponseExtraMsg
  extraMsgList?: HttpResponseExtraMsg[]
  joinedMessage?: string
}
export type HttpResponseData = string | number | boolean | ObjectAnyProp | any[] | null
export type HttpResponseCode = string | number
export interface HttpResponseExtraMsg {
  msg: string
}
