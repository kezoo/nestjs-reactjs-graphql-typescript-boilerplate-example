import { defaultPort } from "../webpackEnv";

export const devServerConfig = {
  client: {
    overlay: false,
  },
  headers: { 'Access-Control-Allow-Origin': '*' },
  historyApiFallback: true,
  hot: true,
  port: defaultPort,
  // proxy: {},
  static: {
    publicPath: '/',
  },
}