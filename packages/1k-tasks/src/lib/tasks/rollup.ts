import { rollup, OutputOptions, RollupOptions, Plugin } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
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
        reset: boolean
    }
    inputOptions?: Omit<RollupOptions, 'input'>
    outputOptions?: Omit<OutputOptions, 'file' | 'plugins'>
}

export const ROLLUP_DEFAULT_CONFIG: rollupConfigType = {
    root: process.cwd(),
    workDir: 'src',
    outputDir: 'dist',
    input: 'index.ts',
    plugin: {
        plugins: [],
        reset: false
    },
    inputOptions: {
        external: [/\.(scss|less|css)$/, /node_modules/]
    },
    outputOptions: {
        format: 'esm'
    }
}

export default async function rollupTask(config?: rollupConfigType): Promise<any> {
    const c = assign({}, ROLLUP_DEFAULT_CONFIG, config)
    const srcPath = mergePath(c.workDir, c.input)
    const srcPathInfo = path.parse(srcPath)
    const bundle = await rollup({
        input: mergePath(c.root, srcPath),
        plugins: c.plugin.reset
            ? c.plugin.plugins
            : [
                  nodeResolve(),
                  commonjs(),
                  babel({
                      extensions: [...DEFAULT_EXTENSIONS, '.ts', 'tsx'],
                      babelHelpers: 'bundled',
                      exclude: /node_modules/
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
