import { CommonRequestParamForResultHandler, ObjectAnyProp, ResultHandlerWhenUnauthorized, ReturnForRequest, WhenUnauthorizedDataFromApiParams } from "./Interface.restLib"
import { getValue, isObject, isValueEmpty } from "./Util.restLib"

export const UNAUTHORIZED_CODE = 401
const errMsgs = {
  common: '啊哦，请求失败了，一会儿再试下吧',
  timeout: '竟然请求超时了，重试下？',
  unauthorized: '身份认证失败，无法完成该请求',
}

interface ResultDataProps {
  [key: string]: any
  err: ObjectAnyProp | undefined
  body: ObjectAnyProp | undefined
  statusCode?: number | undefined
  forResultHandler?: CommonRequestParamForResultHandler
}
export const resultHandler = (result: ResultDataProps) => {
  const { err, body, statusCode, forResultHandler } = result
  const { codeName = '', successCode, whenUnauthorized, errmsgName, unauthorizedErrMsg, doNotPopErr, preferredPopErrMethod, dataName, dataPath, doRetryWhenGotErr, requestAction, codePaths, messagePaths, successCodeList, doReceiveBodyData, upBodyData, dataFromApi } = forResultHandler || {}
  const {unauthorizedCode = UNAUTHORIZED_CODE, authUrl, urlParamsForReturning} = whenUnauthorized || {}
  const toReturn: ReturnForRequest = {
    hasErr: false,
    code: -1000,
    errmsg: '',
  }
  if (upBodyData && body && isObject(body)) {
    Object.assign(body, upBodyData)
  }
  // console.log(`resultHandlerFunc RES `, body)
  const errMsgSign = errmsgName || 'errmsg'
  const hasCustomCode = codeName && !isValueEmpty(successCode)
  const customCode = hasCustomCode && body && body[codeName]
  let toUseCode: string | number = ''
  let apiMsg = ''
  if (codePaths && codePaths.length) {
    for (const cPath of codePaths) {
      const fValue = getValue(body, cPath)
      if (!isValueEmpty(fValue) && !toUseCode) {
        toUseCode = fValue
      }
    }
  }
  if (!toUseCode) {
    toUseCode = !isValueEmpty(customCode) ? customCode : statusCode
  }
  console.log(`resultHandlerFunc toUseCode ${toUseCode}`)
  if (messagePaths && messagePaths.length) {
    for (const cPath of messagePaths) {
      const fValue = getValue(body, cPath)
      if (fValue !== false && !isValueEmpty(fValue) && !apiMsg) {
        apiMsg = fValue
      }
    }
  }
  if (apiMsg && /(java|sql)/gi.test(apiMsg)) {
    apiMsg = ''
  }

  const successCodeR = !isValueEmpty(successCode) ? successCode : 200
  const isCodeSuccess = successCodeList ? successCodeList.includes(toUseCode) : toUseCode === successCodeR
  const isTimeout = !!(err && err.timeout)
  const unauthorizedCodeR = !isValueEmpty(unauthorizedCode) ? unauthorizedCode : UNAUTHORIZED_CODE
  const isUnauthorized = toUseCode === unauthorizedCodeR

  toReturn.hasErr = !isCodeSuccess || isTimeout || isUnauthorized
  toReturn.code = toUseCode
  // console.log(`resultHandler toUseCode ${toUseCode} apiMsg `, apiMsg, ` toReturn `, toReturn)
  const retryAction = (rParams?: { err?: string }) => {
    /* onModal({
      doSet: true,
      params: {
        newModal: {
          openModal: true, modalType: 'choice',
          message: (rParams && rParams.err) || '请求失败了，要重试吗？',
          requireCloseAction: true,
          choiceLabelConfirm: '重试',
          choiceOnConfirm() {
            return requestAction && requestAction()
          },
          ...popupModalProps
        }
      }
    }) */
  }

  if (toReturn.hasErr) {
    toReturn.errmsg = apiMsg || (body && body[errMsgSign]) || errMsgs.common
    let retryMsg = ''
    if (isTimeout) {
      toReturn.errmsg = errMsgs.timeout
      retryMsg = errMsgs.timeout
    }
    if (isUnauthorized) {
      toReturn.errmsg = unauthorizedErrMsg || errMsgs.unauthorized

      /* handleUnauthorizedSituation({whenUnauthorized, dataFromApi: {
        data: body,
        dataPath: ['data'],
        useString: true,
        ...dataFromApi,
      }}) */
    }

    const shouldRetry = isTimeout || doRetryWhenGotErr
    if (shouldRetry) {
      retryAction({ err: retryMsg })
    }
    if (!shouldRetry && !doNotPopErr) {
      const toUseMethod = preferredPopErrMethod || 'toast'

      if (toUseMethod === 'toast') {
        /* onToast({
          toast: {
            message: toReturn.errmsg,
            bgType: 'warning',
          }
        }) */
      }
      if (toUseMethod === 'modal') {
        /* onModal({
          doSet: true,
          params: {
            newModal: {
              openModal: true, modalType: 'reminder', message: toReturn.errmsg, requireCloseAction: true,
            }
          }
        }) */
      }
    }
  }
  if (!toReturn.hasErr || (toReturn.hasErr && doReceiveBodyData)) {
    const dataR = body && (dataPath ? getValue(body, dataPath) : dataName ? body[dataName] : body)
    toReturn.data = dataR
  }
  // console.log(`RESULT isTimeout ${isTimeout} HANDLER DATA doReceiveBodyData ${doReceiveBodyData}: `, toReturn, `\nbodyData `, body)
  return toReturn
}
export interface HandleUnauthorizedSituationParams {
  whenUnauthorized?: ResultHandlerWhenUnauthorized
  skipReminder?: boolean
  dataFromApi?: WhenUnauthorizedDataFromApiParams
}
export function handleUnauthorizedSituation (p: HandleUnauthorizedSituationParams) {
  const {whenUnauthorized, skipReminder, dataFromApi} = p

  if (whenUnauthorized) {
    const {unauthorizedCode = UNAUTHORIZED_CODE, authUrl, urlParamsForReturning, dataFromApi: dataFromApi_In} = whenUnauthorized || {}
    const dFromApi = {...dataFromApi_In, ...dataFromApi}
    const {data, dataPath, useString} = dFromApi
    let tData = (isObject(data) && dataPath) ? getValue(data, dataPath) : {}
    tData = isObject(tData) ? tData : {}
    if (useString) {
      tData = JSON.stringify(tData)
    }

    if (authUrl) {
      const uParams = {...urlParamsForReturning, dataFromApi: tData}
      if (!skipReminder) {
        /* onToast({
          toast: {
            message: `未检测到Token或Token已过期, 请登录后继续`, bgType: 'warning'
          }
        }) */
      }
      /* onNextWithTimeout({
        onNext: () => {
          location.href = `${authUrl}?${parseObjectToUrlParams(uParams)}`
        },
        timeoff: skipReminder ? 0 : 1500,
      }) */
    }
  }
}
