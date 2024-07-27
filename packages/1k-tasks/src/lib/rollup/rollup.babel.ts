import babel, { RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import { babelOptionsType } from './rollup.type'
import { extensions } from './rollup.constnat'
export function createBabelPlugin(options: babelOptionsType) {
    const babelOptions: RollupBabelInputPluginOptions = {
        targets: options?.targets || { chrome: '87' },
        include: options.include,
        extensions: options.extensions || extensions,
        babelHelpers: 'bundled',
        exclude: options?.exclude || /node_modules/,
        presets: [
            require.resolve('@babel/preset-env'),
            require.resolve('@babel/preset-typescript')
        ],
        plugins: []
    }
    babelOptions.presets = babelOptions.presets.concat(options?.presets || [])
    babelOptions.plugins = babelOptions.plugins.concat(options?.plugins || [])
    return babel(babelOptions)
}
