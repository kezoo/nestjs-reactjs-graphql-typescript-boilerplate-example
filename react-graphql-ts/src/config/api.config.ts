interface GetApiConfParams {
}
interface GetApiConfItem {
  mainApiHost: string
}
interface GetApiConfData {
  [key: string]: GetApiConfItem
}
export function getApiConf(p: GetApiConfParams) {
  const { } = p
  const envName = process.env.NODE_ENV || 'development'
  console.log(`getApiConf ENV_NAME ------------------ `, envName)
  const { mockingApiUrl } = getPrivateConfig()
  const conf: GetApiConfData = {
    development: {
      mainApiHost: 'http://localhost:8123',
    },
    test: {
      mainApiHost: '',
    },
    production: {
      mainApiHost: '',
    },
  }
  const tConf = conf[envName]
  return tConf
}
interface PrivateConf {
  loginUrl: string
  mockingApiUrl: string
}
interface GetPrivateConfigParams {}
export function getPrivateConfig(p?: GetPrivateConfigParams) {
  const pConf: PrivateConf = {
    loginUrl: '',
    mockingApiUrl: '',
  }
  try {
    const { privateConfig } = require('../config/private.config')
    if (privateConfig) {
      Object.assign(pConf, privateConfig)
    }
  } catch (err) {
    // console.error('loginWithSSO NO CONF ', err)
  }
  return pConf
}
