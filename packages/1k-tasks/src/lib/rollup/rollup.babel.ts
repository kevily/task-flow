import babel, { RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import { rollupConfigType } from './rollup.type'
import { extensions } from './rollup.constnat'

export function createBabelPlugin(c: rollupConfigType) {
    const options: RollupBabelInputPluginOptions = {
        targets: c.babel?.targets,
        extensions,
        babelHelpers: 'bundled',
        exclude: c.babel?.exclude || /node_modules/,
        presets: [
            require.resolve('@babel/preset-env'),
            require.resolve('@babel/preset-typescript'),
            [
                require.resolve('@babel/preset-react'),
                {
                    runtime: 'automatic'
                }
            ]
        ],
        plugins: c.babel?.plugins
    }
    return babel(options)
}
