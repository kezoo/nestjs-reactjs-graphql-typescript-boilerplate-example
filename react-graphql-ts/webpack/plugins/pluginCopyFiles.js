import CopyPlugin from 'copy-webpack-plugin'
import { join } from 'path'
import { rootDir } from '../webpackEnv'

export const copyWebpackPlugin = new CopyPlugin({
  patterns: [
    {
      from: join(rootDir, 'public'),
      noErrorOnMissing: true,
    }
  ]
});
