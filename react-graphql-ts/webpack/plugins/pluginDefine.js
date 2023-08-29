import { DefinePlugin } from 'webpack';
import { isDev, isDevServer, isProd, mode } from '../webpackEnv';

const config = {
  'process.env': {
    NODE_ENV: JSON.stringify(mode),
  },
  IS_PROD: isProd,
  IS_DEV: isDev,
  IS_DEV_SERVER: isDevServer,
};

export const defineWebpackPlugin = new DefinePlugin(config);