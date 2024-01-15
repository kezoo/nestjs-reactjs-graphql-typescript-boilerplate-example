import superagent from 'superagent'
import { CommonRequestParamsToAction, ObjectAnyProp } from "./restLib.interface"
import { parseObjectToUrlParams, validJson } from "./restLib.util"
import { resultHandler } from "./restResultHandler"

const methods = ['get', 'post', 'put', 'patch', 'del']

function formatUrl(path: string) {
  const hasSlash = (path[0] === '/')
  const adjustedPath = hasSlash ? path : '/' + path
  const apiPrefix = '' // api
  return apiPrefix + adjustedPath;
}

export class ApiRequest {
  constructor() {

    let ths: Record<string, any> = {}
    ths = this

    methods.forEach(method =>

      ths[method] = (
        path: any,
        {
          params, data, toWait, toDeadline, files = [], forResultHandler,
          headerOptions, filesName, responseType,
        }: CommonRequestParamsToAction
      ) => new Promise((resolve, reject) => {
        console.log(`ApiRequest method ${method} `)
        const isGet = method.toUpperCase() === 'GET'
        const isPost = method.toUpperCase() === 'POST'
        const responseWait = toWait || 15000
        const deadline = toDeadline || 16000
        const contentType = 'application/json'
        const hasFiles = files && files[0]
        let url = path

        params = (typeof params === 'object') ? params : {}
        data = (typeof data === 'object') ? data : {}

        let finalParams: ObjectAnyProp = {}

        if (typeof params === 'object') {
          finalParams = Object.assign(finalParams, params)
        }

        if (typeof data === 'object') {
          finalParams = Object.assign(finalParams, params, data)
        }

        if (isGet) {
          const uStr = parseObjectToUrlParams(finalParams)
          const uStrWith = (uStr ? '?' : '') + uStr
          url = `${url}${uStrWith}`
        }

        if (isPost && typeof finalParams.urlParams === 'object') {
          url = `${url}?${parseObjectToUrlParams(finalParams.urlParams)}`
        }
        const sMethods: {
          [key: string]: any
        } = {
          get: superagent.get,
          post: superagent.post,
          put: superagent.put,
          del: superagent.delete,
        }
        const request = sMethods[method](url).timeout({
          response: responseWait,
          deadline,
        })
        // console.log(`responseWait ${responseWait} deadline ${deadline} \nURL ${url}`)
        !hasFiles && request.set('Content-Type', finalParams.contentType || contentType)
        // request.set('Accept-Language', userLang)
        // request.set('User-time', Date.now())

        // if (userToken) {
        //   request.set('Authorization', userToken)
        // }

        if (headerOptions) {
          for (const [headerName, headerValue] of Object.entries(headerOptions)) {
            request.set(headerName, headerValue)
          }
        }

        if (finalParams.useFormParams) {
          delete finalParams.useFormParams
          request.type('form')
        }

        const onRes = (err: any, resObj: any = {}) => {
          let { body, text } = resObj
          const { statusCode } = resObj

          // G_log(`Full Request ↓↓↓↓↓`, request)
          console.log(`↓↓↓↓↓↓↓↓↓↓ FullResponse resObj ↓↓↓↓↓`, resObj)
          console.log(`↓↓↓↓↓↓↓↓↓↓ FullResponse ERR ↓↓↓↓↓`, err)

          if (!body && text) {
            text = validJson(text) ? JSON.parse(text) : text
            body = text
          }
          const resultAction = () => {
            return resultHandler({
              err, body, statusCode, forResultHandler,
            })
          }
          err ?
            reject(resultAction()) :
            resolve(resultAction())
        }

        const formData = new FormData()
        if (hasFiles) {
          // request.set('Content-Type', 'multipart/form-data')
          request.field(finalParams)
          try {
            for (let fIndex = 0; fIndex < files.length; fIndex++) {
              const nFile = files[fIndex]
              const mName = `img${fIndex}`
              const nName = filesName || mName
              if (nFile && nFile.file) {
                request.field(nName, nFile.file)
                // formData.append(nName, nFile.file)
              }
            }
            request.then((res: any) => onRes(null, res)).catch((err: any, others?: any) => {
              onRes(err, { body: '上传失败' })
            })
          }
          catch (err) {
            console.error(`Error when up files `, err)
          }
          return
        }

        if (!isGet) {
          const sendData = (finalParams.sendBodyOnly ? finalParams.sendBodyOnly : finalParams)
          request.send(sendData)
        }
        if (isGet && responseType) {
          request.responseType(responseType)
        }
        request.end(onRes)
      }))
  }
  empty() { }
}
