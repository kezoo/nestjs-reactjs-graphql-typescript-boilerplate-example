import knexLib, { Knex } from 'knex'
import { APP_CONS } from '../constants/general.constant'
import { KnexConnection, KnexDbClientObj } from '../interfaces/database.interface'
import { getCompactedConfig } from '../utils/app.util'

export async function initKnex () {
  // const knex = require('knex')
  const conf = getCompactedConfig()
  const dbType = conf.db.type
  const dbName = conf.db.name
  const connection: KnexConnection = {
    host: conf.db.host,
    port: Number(conf.db.port),
    user: conf.db.username,
    password: conf.db.password,
  }
  const clients: KnexDbClientObj[] = [
    {
      type: 'mysql',
      options: {
        client: 'mysql2',
        connection,
      }
    },
    {
      type: 'postgres',
      options: {
        client: 'pg',
        connection,
      }
    }
  ]
  const findClient = clients.find(item => item.type === dbType)

  if (findClient) {
    let knexDb: Knex = knexLib(findClient.options)

    try {
      await knexDb.raw('CREATE DATABASE IF NOT EXISTS ??', dbName)

      if (findClient.options.connection) {
        findClient.options.connection.database = dbName
        knexDb = knexLib(findClient.options)
        APP_CONS.knexDb = knexDb

        console.log(`knexDb CONNECTED`)
      }
    }
    catch (error) {
      console.error(`knexDb conn err `, error)
    }


  }

}
