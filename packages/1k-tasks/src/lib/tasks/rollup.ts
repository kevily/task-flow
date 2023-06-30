import { rollup, OutputOptions, RollupOptions, Plugin } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import url from '@rollup/plugin-url'
import svgr from '@svgr/rollup'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import { assign, forEach, isArray, isObject, map } from 'lodash'
import { mergePath } from '../utils'
import { EngineConfigType } from '../types'

export interface rollupConfigType extends EngineConfigType {
    input?: RollupOptions['input']
    /**
     * @default dist
     */
    outputDir?: OutputOptions['dir']
    plugin?: {
        plugins: Plugin[]
        overwrite: boolean
    }
    inputOptions?: Omit<RollupOptions, 'input'>
    outputOptions?: Omit<OutputOptions, 'plugins' | 'dir'>
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

function genInput(workDir: rollupConfigType['workDir'], input: rollupConfigType['input']) {
    if (isArray(input)) {
        return map(input, input => genInput(workDir, input))
    }
    if (isObject(input)) {
        const newInput: { [entryAlias: string]: string } = {}
        forEach(input, (input, k) => {
            newInput[k] = genInput(workDir, input)
        })
        return newInput
    }
    return mergePath(workDir, input as string)
}

async function rollupTask(config?: rollupConfigType): Promise<any> {
    const c = assign({}, createDefaultConfig(), config)
    const bundle = await rollup({
        input: genInput(c.workDir, c.input),
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
    await bundle.write({
        dir: mergePath(c.root, c?.outputDir),
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
