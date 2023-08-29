/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
import {
    cssLoader, cssLoaderItems, cssModulesSupportLoaderItems, lessLoader, miniCssExtractLoader,
    postCssLoader, resolveUrlLoader, sassLoaderItems
} from './useLoaderRuleItems';

export const cssRule = {
    test: /\.css$/,
    use: [miniCssExtractLoader, cssLoader, postCssLoader],
};

export const lessModulesRule = {
    test: /\.module.less$/,
    use: [
        ...cssModulesSupportLoaderItems,
        postCssLoader,
        resolveUrlLoader,
        lessLoader,
    ],
};
export const lessRule = {
    test: /\.less$/,
    exclude: /\.module.less$/,
    use: [
        ...cssLoaderItems,
        postCssLoader,
        resolveUrlLoader,
        lessLoader,
    ],
};

export const lessRules = [lessModulesRule, lessRule];

export const sassModulesRule = {
    test: /\.module\.s([ca])ss$/,
    use: [
        ...cssModulesSupportLoaderItems,
        postCssLoader,
        resolveUrlLoader,
        ...sassLoaderItems,
    ],
};

export const sassRule = {
    test: /\.s([ca])ss$/,
    exclude: /\.module.scss$/,
    use: [
        ...cssLoaderItems,
        postCssLoader,
        resolveUrlLoader,
        ...sassLoaderItems,
    ],
};

export const sassRules = [sassModulesRule, sassRule];
