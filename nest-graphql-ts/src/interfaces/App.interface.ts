import { Knex } from 'knex'
import { DataSourceOptions } from 'typeorm'

export interface ConfigType {
  app: ConfigAppType
  server: ConfigServerType
  db: ConfigDatabaseType
  dbConfig?: DbConfig
  dbUrl?: string
}
export interface ConfigAppType {
  name: string
  version: string
}
export interface ConfigServerType {
  port?: number
}
export interface ConfigDatabaseType {
  type: DatabaseType
  host: string
  port: number
  username: string
  password: string
  name: string
}
export interface DbConfig {
  type?: DatabaseType
  host?: string
  port?: number
  user?: string
  username?: string
  pass?: string
  password?: string
  name?: string
  dbName?: string
}
export type DatabaseType = 'mysql' | 'postgres' | 'mongodb' | 'sqlite' | 'mariadb'
export interface AppConstant {
  config?: ConfigType
  knexDb?: Knex
}
export type NodeEnvTypes = 'development' | 'test' | 'production'
export type OrmConfigs = {
  [type in NodeEnvTypes]?: {
    config: DataSourceOptions
  }
}
export interface ObjectAnyProp {
  [key: string]: any
}
