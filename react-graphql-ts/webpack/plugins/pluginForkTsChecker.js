import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { join } from 'path';
import { isDev, rootDir } from '../webpackEnv';

const config = {
  async: isDev,
  typescript: {
    configFile: join(rootDir, '/tsconfig.json'),
  },
  eslint: { enabled: true, files: '../src/**/*.{ts,tsx}' },
};

export const forkTsCheckerWebpackPlugin = new ForkTsCheckerWebpackPlugin(
  config,
);