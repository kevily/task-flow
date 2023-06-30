import { rollup, OutputOptions, RollupOptions, Plugin } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import url from '@rollup/plugin-url'
import svgr from '@svgr/rollup'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import * as path from 'path'
import { assign } from 'lodash'
import { mergePath } from '../utils'
import { EngineConfigType } from '../types'

export interface rollupConfigType extends EngineConfigType {
    input?: string
    /**
     * @default dist
     */
    outputDir?: string
    plugin?: {
        plugins: Plugin[]
        overwrite: boolean
    }
    inputOptions?: Omit<RollupOptions, 'input'>
    outputOptions?: Omit<OutputOptions, 'file' | 'plugins'>
}

function createDefaultConfig(): rollupConfigType {
    return {
        root: process.cwd(),
        workDir: 'src',
        outputDir: 'dist',
        input: 'index.ts',
        plugin: {
            plugins: [],
            overwrite: false
        },
        inputOptions: {
            external: [/\.(scss|less|css)$/, /node_modules/]
        },
        outputOptions: {
            format: 'esm'
        }
    }
}

async function rollupTask(config?: rollupConfigType): Promise<any> {
    const c = assign({}, createDefaultConfig(), config)
    const srcPath = mergePath(c.workDir, c.input)
    const srcPathInfo = path.parse(srcPath)
    const bundle = await rollup({
        input: mergePath(c.root, srcPath),
        plugins: c.plugin.overwrite
            ? c.plugin.plugins
            : [
                  nodeResolve(),
                  commonjs(),
                  url({
                      limit: 10000 // 10kB
                  }),
                  ...c.plugin.plugins
              ],
        ...c.inputOptions
    })
    const output = mergePath(c.root, c?.outputDir)
    await bundle.write({
        file: mergePath(output, `${srcPathInfo.name}.${c.outputOptions.format}.js`),
        ...c.outputOptions
    })
    await bundle.close()
}

rollupTask.DEFAULT_CONFIG = createDefaultConfig()

rollupTask.REACT_CONFIG = (() => {
    const config = createDefaultConfig()
    config.plugin.plugins = [
        svgr({
            svgo: false,
            titleProp: true,
            ref: true
        }),
        babel({
            extensions: [...DEFAULT_EXTENSIONS, '.ts', 'tsx'],
            babelHelpers: 'bundled',
            exclude: /node_modules/
        })
    ]
    return config
})()

export default rollupTask
