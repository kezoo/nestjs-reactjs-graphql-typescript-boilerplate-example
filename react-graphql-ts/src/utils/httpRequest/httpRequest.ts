import { getDispatch } from "../../createReduxStore"
import { MakeSagaActionParams } from "./restLib/restLib.interface"
import { makeSagaAction } from "./restLib/restWithSaga"


interface SendRequestParams {
  params: MakeSagaActionParams
}
export function sendRestRequest(p: SendRequestParams) {
  const { params } = p
  const sagaPayload: MakeSagaActionParams = {
    useCommonAction: true,
    ...params,
  }
  if (!sagaPayload.payload.headerOptions) {
    sagaPayload.payload.headerOptions = {}
  }
  // const { user } = handleUserState({})
  // if (!sagaPayload.payload.headerOptions.token && user.token) {
  //   sagaPayload.payload.headerOptions.token = user.token
  // }
  if (!sagaPayload.payload.forResultHandler) {
    sagaPayload.payload.forResultHandler = {}
  }
  // sagaPayload.payload.forResultHandler.codePaths = [['code'], ['data', 'code'], ['status']]
  // sagaPayload.payload.forResultHandler.messagePaths = [['message'], ['data', 'message']]
  // sagaPayload.payload.forResultHandler.successCodeList = ['0', 200]
  if (!sagaPayload.payload.useAppDispatch) {
    sagaPayload.payload.useAppDispatch = getDispatch()
  }
  makeSagaAction(sagaPayload)
}
