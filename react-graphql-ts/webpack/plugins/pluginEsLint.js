import ESLintPlugin from 'eslint-webpack-plugin';
import { join } from 'path';
import { rootDir } from '../webpackEnv';

const config = {
  context: join(rootDir, '/src'),
  extensions: ['js', 'jsx', 'ts', 'tsx'],
};

export const esLintWebpackPlugin = new ESLintPlugin(config);