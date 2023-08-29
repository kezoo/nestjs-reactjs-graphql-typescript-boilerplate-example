import { registerAs } from '@nestjs/config'
import { resolve } from 'path'
import { Task } from '../modules/todo/task.entity'
import { getCompactedConfig } from '../utils/app.util'


/* const testOptions: DataSourceOptions & SeederOptions = {
  type: 'sqlite',
  database: ':memory:',
  synchronize: false,
  migrationsRun: true,
  entities: [Task],
  migrations: [CreateTask1654578859820],
  factories: [TaskFactory],
  seeds: [TaskSeeder],
};
 */
// used by CLI commands
// export const AppDataSource = new DataSource({ ...mainOptions });

export default registerAs('orm', () => {
  const isDev = process.env.NODE_ENV === 'development'
  const migrationPath = resolve(__dirname, isDev ? `../migrations/**/*.ts` : `dist/migrations/**/*.js`,)
  const conf = {
    type: getCompactedConfig().db.type,
    url: getCompactedConfig().dbUrl,
    synchronize: false,
    entities: [Task],
    // migrations: [migrationPath],
    // migrations: [`../migrations/**/*{.ts,.js}`],
    // cli: {
    //   migrationsDir: '../migrations',
    // },
    migrations: [__dirname + '../migrations/**/*{.ts,.js}'],
    cli: {
      // Location of migration should be inside src folder
      // to be compiled into dist/ folder.
      migrationsDir: 'src/migrations',
    },
    migrationsRun: false
  }

  console.log(`ORMConfig `, conf, `\nmigrationPath ${migrationPath}`)
  return conf
});
