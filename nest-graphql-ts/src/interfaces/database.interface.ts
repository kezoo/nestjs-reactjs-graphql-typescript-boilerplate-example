import { DatabaseType } from "./App.interface"

export interface KnexConnection {
  host: string
  port: number
  user: string
  password: string
  database?: string
}
export interface KnexDbClientObj {
  type: DatabaseType
  options: KnexDbClientOption
}
export interface KnexDbClientOption {
  client?: string
  connection?: KnexConnection
}
