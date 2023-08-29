

interface StringIndexedStrObj {
  [key: string]: string,
}
export const regHttp = /^(http|https)/i

export const getSelect = (table: string, prefix: string, fields: any) => {
  return fields.map((f: string) => `${table}.${f} as ${prefix}_${f}`)
}

export const isObject = (obj: any) => {
  const type = typeof obj
  return type === 'object' && !!obj && !isFunction(obj) && !isArray(obj)
}

export const isArray = (obj: any) => {
  return Array.isArray(obj)
}

export const isString = (obj: any) => {
  return Object.prototype.toString.call(obj) === '[object String]'
}

export const isDate = (obj: any) => {
  return Object.prototype.toString.call(obj) === '[object Date]'
}

export const isNum = (obj: any) => {
  return Object.prototype.toString.call(obj) === '[object Number]'
}

export const isBoolean = (obj: any) => {
  return obj === true || obj === false || Object.prototype.toString.call(obj) === '[object Boolean]'
}

export const isNull = (obj: any) => {
  return obj === null
}

export const isFloat = (n: any) => {
  return Number(n) === n && n % 1 !== 0;
}

export const isUndefined = (obj: any) => {
  return typeof obj === 'undefined'
}

export const isFunction = (obj: any) => {
  return typeof obj === 'function'
}

export const oHas = (obj: any, key: string) => {
  return obj != null && Object.hasOwnProperty.call(obj, key)
}

export const isExpired = (dateA: string | number | Date, comparison: number) => {
  const tData: any = new Date(dateA)
  const dateNow: any = new Date()
  const dateDiff: number = Math.abs(dateNow - tData)
  const hoursDiff = dateDiff / 36e5
  return hoursDiff > comparison
}

export const getValue: (obj: any, route: string[]) => any = (obj, route) => {

  if (!obj) return false
  if (!Array.isArray(route) || !route.length) return false

  let returnValue = ''

  route.forEach((item: any) => {
    if (isObject(obj) && oHas(obj, item)) {
      obj = obj[item]
      returnValue = obj
    }
    else {
      obj = false
      returnValue = ''
    }

  })

  return returnValue

}

export const arrayDifference = (arrA: any[], arrB: any[]) => {
  return arrA.filter((key: string) => !arrB.includes(key))
}

export const arrayIntersection= (arrA: any[], arrB: any[]) => {
  return arrA.filter((key: string) => arrB.includes(key))
}

export const generateNumbers = (numLen = 8, generateLen = 1) => {
  // const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const codes: any = []
  const genOne = (generateLen === 1)
  let addNums: any = []

  const addFn = () => {
    const addNum = Math.floor(Math.random() * 10)
    const bindAdd = addFn.bind(null)
    if (addNum === 0 && !addNums.length) {
      return bindAdd
    }
    if (addNums.length <= 9) {
      if (!addNums.includes(addNum)) {
        addNums.push(addNum)
      }
    }
    else {
      addNums.push(addNum)
    }

    if (addNums.length < numLen) {
      return bindAdd
    }
    if (addNums.length === numLen && codes.length < generateLen) {
      const code = Number(addNums.join(''))
      if (!codes.includes(code)) {
        codes.push(code)
      }
      addNums = []
      return bindAdd
    }
    return genOne ? codes[0] : codes
  }

  let genFn = addFn()
  while (genFn  && genFn instanceof Function) {
    genFn = genFn()
  }
  return genFn
}

export const validJson = (obj: any) => {
  try {
    JSON.parse(obj)
  }
  catch (e) {
    return false
  }
  return true
}

export const deepClone = (obj: object) => {
  return JSON.parse(JSON.stringify(obj))
}

export const objectKeepKeys = (obj: StringIndexedStrObj, keys: string[], noClone?: boolean) => {
  const objClone = noClone ? obj : deepClone(obj)
  const objKeys = Object.keys(objClone)

  if (!keys.length) return objClone

  for (let i = 0; i < objKeys.length; i++) {
    const tKey = objKeys[i]
    if (!keys.includes(tKey)) {
      delete objClone[tKey]
    }
  }

  return objClone
}

export const objectOmitKeys = (obj: StringIndexedStrObj, keys: string[], noClone?: boolean) => {
  const objClone = noClone ? obj : deepClone(obj)
  const objKeys = Object.keys(objClone)

  if (!keys.length) return objClone

  for (let i = 0; i < objKeys.length; i++) {
    const tKey = objKeys[i]
    if (keys.includes(tKey)) {
      delete objClone[tKey]
    }
  }

  return objClone
}
