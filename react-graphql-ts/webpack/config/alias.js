import { join } from 'path';
import { rootDir } from '../webpackEnv';

export const aliasItems = {
  '@src': join(rootDir, '/src'),
  '@images': join(rootDir, '/src/images'),
  '@styles': join(rootDir, '/src/assets/styles'),
  '@components': join(rootDir, '/src/components'),
  // 'react': require.resolve("../../node_modules/react"),
  // 'react-dom': require.resolve("../../node_modules/react-dom"),
};