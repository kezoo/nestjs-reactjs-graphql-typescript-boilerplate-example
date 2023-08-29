export function deepClone(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}

export function isValueEmpty(val: any) {
  const isUndefined = typeof val === 'undefined'
  const isNull = val === null
  const isStringEmpty = (typeof val === 'string' && val.trim() === '')
  return isUndefined || isNull || isStringEmpty
}

export function isFloat(n: number) {
  return Number(n) === n && n % 1 !== 0
}

export function isObject(obj: any) {
  const type = typeof obj
  return type === 'object' && !!obj && !isFunction(obj) && !isArray(obj)
}

export function isArray(obj: any) {
  return Array.isArray(obj)
}

export function isString(obj: any) {
  return Object.prototype.toString.call(obj) === '[object String]'
}

export function isEmpty(obj: any) {
  return isString(obj) && obj.trim() === ''
}

export function isDate(obj: any) {
  return Object.prototype.toString.call(obj) === '[object Date]'
}

export function isValidDate(d: any) {
  return d instanceof Date && !isNaN(d.getTime())
}

export function isNum(obj: any) {
  return Object.prototype.toString.call(obj) === '[object Number]'
}

export function isBoolean(obj: any) {
  return obj === true || obj === false || Object.prototype.toString.call(obj) === '[object Boolean]'
}

export function isNull(obj: any) {
  return obj === null
}

export function isUndefined(obj: any) {
  return typeof obj === 'undefined'
}

export function isFunction(obj: any) {
  return typeof obj === 'function'
}
