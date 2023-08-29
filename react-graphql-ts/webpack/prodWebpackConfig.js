import TerserJSPlugin from 'terser-webpack-plugin';
import { miniCssExtractWebpackPlugin } from './plugins/pluginMinCssExtract';

export default {
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        terserOptions: {
          compress: {
            pure_funcs: [
              'console.log',
              'console.info',
              'console.debug',
            ]
          }
        }
      })
    ],
  },
  plugins: [miniCssExtractWebpackPlugin],
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
}