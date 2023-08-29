import HtmlWebpackPlugin from 'html-webpack-plugin';
import { join } from 'path';
import { rootDir } from '../webpackEnv';

const config = {
  filename: 'index.html',
  inject: true,
  template: join(rootDir, './src/index.html'),
};

export const htmlWebpackPlugin = new HtmlWebpackPlugin(config);