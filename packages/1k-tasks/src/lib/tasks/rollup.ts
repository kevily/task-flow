import { rollup, OutputOptions, RollupOptions, Plugin } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import url from '@rollup/plugin-url'
import svgr from '@svgr/rollup'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import { assign, forEach, isArray, isObject, isString, map, omit } from 'lodash'
import { mergePath } from '../utils'
import { EngineConfigType } from '../types'
import { globSync } from 'glob'
import * as path from 'path'

export interface rollupConfigType extends EngineConfigType {
    /**
     * string/array -> globs
     * obj -> path
     */
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

function genInput(c: rollupConfigType) {
    function relativePath(workDir: rollupConfigType['workDir']) {
        return path.relative(process.cwd(), path.join(c.root, workDir))
    }
    function run(input: rollupConfigType['input']) {
        if (isObject(c.input) && !isArray()) {
            const newInput: { [entryAlias: string]: string } = {}
            forEach(c.input as Record<string, string>, (input, k) => {
                newInput[k] = mergePath(relativePath(c.workDir), input)
            })
            return newInput
        }
        input = map(isString(input) ? [input] : (input as string[]), input => {
            return mergePath(relativePath(c.workDir), input)
        })
        return globSync(input, { ignore: c.ignore })
    }

    return run(c.input)
}

async function rollupTask(config?: rollupConfigType): Promise<any> {
    const c = assign({}, createDefaultConfig(), config)
    const bundle = await rollup({
        input: genInput(c),
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

rollupTask.REACT_CONFIG = {
    plugin: {
        plugins: [
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
        ],
        overwrite: false
    }
} as rollupConfigType

export default rollupTask
