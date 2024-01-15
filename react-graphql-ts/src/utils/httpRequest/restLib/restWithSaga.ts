import { call, put, takeEvery } from 'redux-saga/effects'
import { GET_COMMON_REQUEST_SAGA } from './Constant.restLib'
import { CommonRequestParams, CommonRequestParamsToAction, MakeSagaActionParams, SagaActionParams } from './Interface.restLib'
import { ApiRequest } from './restRequest'

const apiRequest: any = new ApiRequest()
const LABEL_RETRY = 'RETRY'
export function* commonRequest(parameters: CommonRequestParams): any {
  console.log('############################# commonRequestRef parameters', parameters, apiRequest)
  const realArgus = parameters
  realArgus.payload && Object.assign(realArgus, realArgus.payload)
  const {
    method = '', apiUrl, successType, failureType, requireLoader,
    urlParams, jsonData, handleData, doNotPutData, headerOptions,
    toWait, toDeadline, files, forResultHandler, type, filesName,
  } = realArgus
  if (!apiRequest[method]) return false
  if (!apiUrl) return false
  if (requireLoader) {
    // handle loading

    /* onModal({
      doSet: true,
      params: {
        newModal: { openModal: true, modalType: 'loading' }
      }
    }) */
  }
  const retryAction = () => {
    return makeSagaAction({
      type: type || LABEL_RETRY, payload: realArgus,
    })
  }
  const forResultHandlerR = { ...forResultHandler }
  if (!forResultHandlerR.requestAction) {
    forResultHandlerR.requestAction = retryAction
  }
  try {
    const rActionParams: CommonRequestParamsToAction = {
      params: urlParams,
      data: jsonData,
      toWait,
      toDeadline,
      files,
      filesName,
      headerOptions,
      forResultHandler: forResultHandlerR,
    }
    const data: any = yield call(
      apiRequest[method],
      apiUrl,
      rActionParams,
    )
    handleData && handleData(data)
    if (successType && !doNotPutData) {
      yield put({ type: successType, data })
    }
  }
  catch (error) {
    console.error(`********* CommonRequestFunc ERROR `, error)
    handleData && handleData({ hasErr: true, errmsg: 'Internal Error', code: -10000 })
    if (failureType && !doNotPutData) {
      yield put({ type: failureType, error })
    }
  }
  finally {
    if (requireLoader) {
      // remove loading
      // onModal({ params: { removeType: 'loading' }, doSet: true })
    }
  }
}

export function makeSagaAction(p: MakeSagaActionParams) {
  const { type, payload, useCommonAction, } = p
  const uType = useCommonAction ? GET_COMMON_REQUEST_SAGA : (type || '')
  // console.log(`makeSagaAction ${uType} ========== `, payload)
  return payload.useAppDispatch && payload.useAppDispatch({
    type: uType, payload: { ...payload, type: uType }
  })
}

export function* requestCommonAction(params: SagaActionParams): any {
  const rParams: CommonRequestParams = { requireLoader: true, ...params }
  // console.log(`requestCommonAction `)
  yield commonRequest(rParams)
}

export function* watchCommonRequestSagas() {
  yield takeEvery(GET_COMMON_REQUEST_SAGA, requestCommonAction)
}
