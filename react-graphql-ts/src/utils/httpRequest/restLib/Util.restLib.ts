import { ObjectAnyProp } from "./Interface.restLib"

export function validJson(str: any) {
  if (!isString(str)) return false
  try {
    JSON.parse(str)
  }
  catch (e) {
    return false
  }
  return true
}
export function isString(obj: any) {
  return Object.prototype.toString.call(obj) === '[object String]'
}
export function isObject(obj: any) {
  const type = typeof obj
  return type === 'object' && !!obj && !isFunction(obj) && !isArray(obj)
}
export function isFunction(obj: any) {
  return typeof obj === 'function'
}
export function isArray(obj: any) {
  return Array.isArray(obj)
}
export function oHas(obj: any, key: string) {
  return obj !== null && Object.hasOwnProperty.call(obj, key)
}
export function getValue(obj: any, route: any) {
  if (!obj) return false
  if (!Array.isArray(route) || !route.length) return obj

  let returnValue = null

  route.forEach((item: any, itemKey: any) => {
    if (isObject(obj) && oHas(obj, item)) {
      obj = obj[item]
      returnValue = obj
    }
    else {
      obj = false
      returnValue = false
    }
  })

  return returnValue
}
export function isValueEmpty(val: any) {
  const isUndefined = typeof val === 'undefined'
  const isNull = val === null
  const isStringEmpty = (typeof val === 'string' && val.trim() === '')
  return isUndefined || isNull || isStringEmpty
}
export function parseObjectToUrlParams(obj: ObjectAnyProp) {
  const keys = Object.keys(obj)
  const urlParams = keys.reduce((str, key) => {
    const val = obj[key]
    if (!isValueEmpty(val)) {
      const preSign = str ? '&' : ''
      if (isArray(val)) {
        let uString = ''
        for (let i = 0; i < val.length; i++) {
          const vItem = val[i]
          const vKey = `${key}[${i}]`
          const aStr = uString ? '&' : ''
          if (isObject(vItem)) {
            for (const oKey of Object.keys(vItem)) {
              const nKey = encodeURIComponent(`${vKey}.${oKey}`)
              const mPreifx = uString ? '&' : ''
              uString += `${mPreifx}${nKey}=${vItem[oKey]}`
            }
          }
          else {
            uString += `${aStr}${vKey}=${vItem}`
          }
        }
        str += preSign + uString
      }
      else if (isObject(val)) {
        str += `${preSign}${key}=${JSON.stringify(val)}`
      }
      else {
        str += `${preSign}${key}=${val}`
      }

    }
    return str
  }, '')
  return urlParams
}
