import { copyWebpackPlugin } from './pluginCopyFiles';
import { defineWebpackPlugin } from "./pluginDefine";
import { esLintWebpackPlugin } from "./pluginEsLint";
import { forkTsCheckerWebpackPlugin } from "./pluginForkTsChecker";
import { htmlWebpackPlugin } from "./pluginHtml";
import { provideWebpackPlugin } from "./pluginProvide";

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

export const webpackPluginsConfig = [
  htmlWebpackPlugin,
  provideWebpackPlugin,
  defineWebpackPlugin,
  forkTsCheckerWebpackPlugin,
  esLintWebpackPlugin,
  copyWebpackPlugin,
  /* new BundleAnalyzerPlugin({
    analyzerPort: 3789,
  }), */
]