import path from 'path';
import { aliasItems } from './config/alias';
import entry from './entry';
import optimizeWebpack from './optimizeWebpack';
import { webpackPluginsConfig } from './plugins/webpackPluginsConfig';
import { fontsRule, htmlRule, imagesRule, javascriptRule, typescriptRule } from './rules/commonWebpackRules';
import { cssRule, lessModulesRule, lessRule, sassModulesRule, sassRule } from './rules/stylesWebpackLoader';
import { svgRules } from './rules/svgWebpackLoader';
import { isDevServer, isProd } from './webpackEnv';

export default {
  context: __dirname,
  target: isDevServer ? 'web' : ['web', 'es5'],
  mode: isProd ? 'production' : 'development',
  entry,
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: isDevServer ? '/' : '/',
    filename: isDevServer
      ? '[name].[fullhash].js'
      : '[name].[contenthash].js',
  },
  /* node: {
    __filename: true
  }, */
  module: {
    rules: [
      javascriptRule,
      typescriptRule,
      htmlRule,
      imagesRule,
      fontsRule,
      cssRule,
      lessRule,
      lessModulesRule,
      sassModulesRule,
      sassRule,
      ...svgRules,
      {
        include: path.resolve(__dirname, "node_modules/@meronex/icons"),
        sideEffects: false
      }
    ]
  },
  plugins: webpackPluginsConfig,
  resolve: {
    alias: aliasItems,
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    // symlinks: false,
  },
  optimization: optimizeWebpack,
  externals: {
    // jquery: 'jQuery'
  },
};
