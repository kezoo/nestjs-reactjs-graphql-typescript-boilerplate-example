import merge from 'webpack-merge';
import baseConfig from './webpack/baseWebpackConfig';
import devConfig from './webpack/devWebpackConfig';
import prodConfig from './webpack/prodWebpackConfig';
import { isDevServer, isProd } from './webpack/webpackEnv';

export default () =>
  isProd && !isDevServer ? merge(baseConfig, prodConfig) : merge(baseConfig, devConfig);