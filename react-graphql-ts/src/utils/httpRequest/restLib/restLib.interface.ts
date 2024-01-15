export interface ObjectAnyProp {
  [key: string]: any
}
export type TypeGeneralFunc = (argu?: any) => any
export type RequestMethodType = 'get' | 'post' | 'put' | 'del'
export type RequestHandlerInterface = (p: ReturnForRequest) => any
export interface CommonRequestParams extends CommonRequestParamsForRequest {
  method: RequestMethodType
  apiUrl: string
  type?: string
  successType?: string
  failureType?: string
  requireLoader?: boolean
  urlParams?: ObjectAnyProp
  jsonData?: ObjectAnyProp
  handleData?: RequestHandlerInterface
  doNotPutData?: boolean
  payload?: CommonRequestParams
  forResultHandler?: CommonRequestParamForResultHandler
  useAppDispatch?: TypeGeneralFunc
}
export interface CommonRequestParamFile {
  name: string
  type: string
  path: string
}
export interface CommonRequestParamForResultHandler {
  codeName?: string
  successCode?: number | string
  whenUnauthorized?: ResultHandlerWhenUnauthorized
  errmsgName?: string
  unauthorizedErrMsg?: string
  dataName?: string
  dataPath?: string[]
  doNotPopErr?: boolean
  preferredPopErrMethod?: PopErrMethod
  doRetryWhenGotErr?: boolean
  requestAction?: TypeGeneralFunc
  // popupModalProps?: TypeModalOptionalProps
  codePaths?: string[][]
  messagePaths?: string[][]
  successCodeList?: any[]
  doReceiveBodyData?: boolean
  upBodyData?: ObjectAnyProp
  dataFromApi?: WhenUnauthorizedDataFromApiParams
}
export interface ResultHandlerWhenUnauthorized {
  unauthorizedCode?: number
  authUrl?: string
  urlParamsForReturning?: ObjectAnyProp
  dataFromApi?: WhenUnauthorizedDataFromApiParams
}
export type PopErrMethod = 'modal' | 'toast'
export interface CommonRequestParamsForRequest {
  headerOptions?: ObjectAnyProp
  toWait?: number
  toDeadline?: number
  files?: any[]
  filesName?: string
  responseType?: AvailableResponseType
}
export type AvailableResponseType = 'blob' | 'arraybuffer'
export interface CommonRequestParamsToAction extends CommonRequestParamsForRequest {
  params?: ObjectAnyProp
  data?: ObjectAnyProp
  forResultHandler?: CommonRequestParamForResultHandler
}
export interface ReturnForRequest {
  hasErr: boolean
  code: string | number
  errmsg: string
  data?: ObjectAnyProp
}
export interface WhenUnauthorizedDataFromApiParams {
  data?: ObjectAnyProp
  dataPath?: string[]
  useString?: boolean
}
export interface SagaActionParams extends CommonRequestParams {
  type: string
}
export interface MakeSagaActionParams {
  type?: string
  payload: MakeSagaActionParamsPayload
  useCommonAction?: boolean
}
export interface MakeSagaActionParamsPayload extends CommonRequestParams {
}
export interface CommonRequestParamsForActionFn {
  onData?: RequestHandlerInterface
}
