import { getValue, isString, isUndefined } from "."
import { HttpResponse, HttpResponseCode, HttpResponseExtraMsg } from "../interfaces/http.interface"
import { HttpResponseWrapperParams } from "./http.util.interface"

export function httpResponseWrapper (params: HttpResponseWrapperParams) {
  const {
    data = null, errMsg, errObj, useErrCode,
    errMsgPath = ['message'],
    graphqlErrors,
  } = params
  const dDataObj = data && typeof data === 'object' ? data : {data}
  const res: HttpResponse = {
    // ...dDataObj,
    data,
    code: 0,
    status: 200,
    message: errMsg || '',
  }
  let gotError = !!(errMsg || errObj)
  let assignCodeValue: HttpResponseCode
  let assignMessage: string
  let joinedMessage: string
  let extraMsgList: HttpResponseExtraMsg[]

  if (errObj) {
    const eMsg = getValue(errObj, errMsgPath)

    if (isString(eMsg) && eMsg.trim()) {
      assignMessage = eMsg
    }
  }

  if (graphqlErrors) {
    gotError = true
    assignMessage = graphqlErrors[0].message
    extraMsgList = graphqlErrors.map(gE => ({
      msg: gE.message,
    }))
    joinedMessage = graphqlErrors.map(gE => gE.message).join('; ')
  }

  if (joinedMessage) {
    res.joinedMessage = joinedMessage
  }

  if (extraMsgList) {
    res.extraMsgList = extraMsgList
  }

  if (assignMessage) {
    res.message = assignMessage
  }

  if (gotError) {
    assignCodeValue = 1
  }

  if (!isUndefined(useErrCode)) {
    assignCodeValue = useErrCode
  }

  if (!isUndefined(assignCodeValue)) {
    res.code = assignCodeValue
  }

  return res

}
