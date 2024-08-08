import path from 'path'
import babel, { RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import del from 'rollup-plugin-delete'
import { babelOptionsType, bundleConfigType, delPluginOptionsType } from './rollup.type'
import { extensions } from './rollup.constant'

export function babelPlugin(options: babelOptionsType) {
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

export function delPlugin(
    options: delPluginOptionsType,
    bundleConfig: Pick<bundleConfigType, 'root' | 'outputDir'>
) {
    return del({
        ...options,
        targets: (options.targets || [`${bundleConfig.outputDir}/*`]).map(p => {
            return path.resolve(bundleConfig.root, p)
        })
    })
}
