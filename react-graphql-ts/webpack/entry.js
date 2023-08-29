import { join } from 'path';
import { rootDir } from './webpackEnv'

export default {
  main: [
    join(rootDir, '/src/index.tsx'),
    join(__dirname, './utils/cleanConsoleOnHMR.js'),
  ],
};