export default {
  runtimeChunk: {
    name: 'runtime',
  },
  splitChunks: {
    usedExports: true,
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendor',
        chunks: 'initial',
      },
    },
  },
}