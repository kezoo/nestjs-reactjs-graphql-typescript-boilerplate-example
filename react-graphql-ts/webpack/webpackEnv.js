import isWindows from 'is-windows'
import { join } from 'path'

export const mode = process.env.NODE_ENV || 'development';
export const isDevServer = process.env.WEBPACK_IS_DEV_SERVER === 'true';
export const isProd = ['test', 'production'].includes(mode);
export const isDev = !isProd;
export const rootDir = join(__dirname, '../');
export const webpackDir = join(__dirname, './');
export const defaultPort = 8101;
export const devServerHost = isWindows() ? '127.0.0.1' : '0.0.0.0';
console.log(`mode ------------- ${mode} ${isProd} process.env `, /* process.env */)
