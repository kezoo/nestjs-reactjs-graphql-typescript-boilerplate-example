import { APP_CONS } from "../constants/general.constant"
import { ConfigType, DbConfig } from "../interfaces/App.interface"

interface GetCompactedConfigParams {
  dbUsernameProp?: string
  dbUserPassProp?: string
  dbNameProp?: string
  manageDbConfig?: (c: DbConfig) => void
}
export function getCompactedConfig (payload?: GetCompactedConfigParams) {
  const {
    dbUsernameProp = 'username',
    dbUserPassProp = 'password',
    dbNameProp = 'name',
    manageDbConfig,
  } = payload || {}

  if (APP_CONS.config) {
    return APP_CONS.config
  }

  const configInfo: ConfigType = require('config')

  if (process.env.dbHost) {
    configInfo.db.host = process.env.dbHost
  }
  if (process.env.dbPort) {
    configInfo.db.port = Number(process.env.dbPort)
  }
  if (process.env.dbUser) {
    configInfo.db.username = process.env.dbUser
  }
  if (process.env.dbPass) {
    configInfo.db.password = process.env.dbPass
  }
  if (process.env.dbName) {
    configInfo.db.name = process.env.dbName
  }

  if (!configInfo.db.type) {
    configInfo.db.type = 'mysql'
  }

  APP_CONS.config = configInfo
  const dbConfig: DbConfig = {
    type: configInfo.db.type,
    host: configInfo.db.host,
    port: configInfo.db.port,
  }
  Object.assign(dbConfig, {
    [dbUsernameProp]: configInfo.db.username,
    [dbUserPassProp]: configInfo.db.password,
    [dbNameProp]: configInfo.db.name,
  })
  manageDbConfig && manageDbConfig(dbConfig)
  APP_CONS.config.dbConfig = dbConfig
  APP_CONS.config.dbUrl = `${configInfo.db.type}://${configInfo.db.username}:${configInfo.db.password}@${configInfo.db.host}:${configInfo.db.port}/${configInfo.db.name}`

  return configInfo
}
