import { rollup, RollupOptions } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import del from 'rollup-plugin-delete'
import url from '@rollup/plugin-url'
import svgr from '@svgr/rollup'
import { mergePath } from '../tools'
import { bundleConfigType, reactBundleConfigType } from './rollup.type'
import { extensions, reactExtensions } from './rollup.constnat'
import { createDefaultConfig, genInput } from './rollup.tool'
import { createBabelPlugin } from './rollup.babel'

export async function build(config: bundleConfigType) {
    const c: bundleConfigType = { ...createDefaultConfig(), ...config }
    const options = {
        input: genInput(c),
        ...c.inputOptions,
        plugins: [
            c.delPlugin && del({ targets: [c.outputDir], ...c.delPlugin }),
            c.nodeResolve && nodeResolve({ extensions, ...c.nodeResolve }),
            c.commonjs && commonjs(c.commonjs),
            c.urlPlugin && url({ limit: 10 * 1000, ...c.urlPlugin }),
            c.babel && createBabelPlugin(c.babel),
            ...(c.inputOptions.plugins || [])
        ]
    } satisfies RollupOptions
    const bundle = await rollup(options)
    await bundle.write({
        dir: mergePath(c.root, c.outputDir),
        preserveModules: true,
        ...c.outputOptions
    })
    await bundle.close()
}

export async function buildReact(config?: reactBundleConfigType): Promise<void> {
    const c: reactBundleConfigType = { ...createDefaultConfig(), svgrPlugin: {}, ...config }

    await build({
        ...c,
        inputOptions: {
            ...c.inputOptions,
            plugins: [
                c.svgrPlugin && svgr({ svgo: false, titleProp: true, ref: true, ...c.svgrPlugin }),
                ...(c.inputOptions?.plugins || [])
            ]
        },
        nodeResolve: c.nodeResolve ? { extensions: reactExtensions, ...c.nodeResolve } : false,
        babel: {
            ...c.babel,
            extensions: c.babel.extensions || reactExtensions,
            presets: [
                [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
                ...(c.babel?.presets || [])
            ]
        }
    })
}
