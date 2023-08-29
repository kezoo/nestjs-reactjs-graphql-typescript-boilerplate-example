import { isProd } from '../webpackEnv';

module.exports = () => {
    const plugins = [
        'autoprefixer',
        isProd ? 'cssnano' : null,
    ];
    if (isProd) {
        plugins.push('cssnano')
    }
    return {
        plugins,
    };
};
