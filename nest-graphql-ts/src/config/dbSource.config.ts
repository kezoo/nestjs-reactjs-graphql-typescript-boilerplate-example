require('../lib/initEnvAndConfig')
import { resolve } from 'path'
import { DataSource } from 'typeorm'
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import { getCompactedConfig } from '../utils/app.util'

const options: MysqlConnectionOptions = {
  type: getCompactedConfig().db.type as 'mysql',
  url: getCompactedConfig().dbUrl,
  synchronize: false,
  entities: [
    resolve(__dirname, '../modules/**/*.entity{.ts,.js}'),
  ],
  // migrations: [migrationPath],
  // migrations: [`../migrations/**/*{.ts,.js}`],
  // cli: {
  //   migrationsDir: '../migrations',
  // },
  migrations: [
    resolve(__dirname, '../migrations/**/*{.ts,.js}'),
  ],
}
console.log(`dbSource config options `, options)
export default new DataSource(options)
