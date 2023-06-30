import { rollup, OutputOptions, RollupOptions, Plugin } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import babel, { RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import url from '@rollup/plugin-url'
import svgr from '@svgr/rollup'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import { assign, forEach, isArray, isObject, isString, map } from 'lodash'
import { mergePath } from '../utils'
import { EngineConfigType } from '../types'
import { globSync } from 'glob'
import * as path from 'path'

export interface rollupConfigType extends EngineConfigType {
    /**
     * @default ts
     */
    projectType?: 'ts' | 'react'
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
        projectType: 'ts',
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
function createBabelPlugin(c: rollupConfigType) {
    const options: RollupBabelInputPluginOptions = {
        extensions: [...DEFAULT_EXTENSIONS, '.ts'],
        babelHelpers: 'bundled',
        exclude: /node_modules/,
        presets: [require.resolve('@babel/preset-env'), require.resolve('@babel/preset-typescript')]
    }
    if (c.projectType === 'react') {
        options.extensions.push(...['tsx', 'jsx'])
        options.presets.push(require.resolve('@babel/preset-react'))
    }
    return babel(options)
}
const DEFAULT_PLUGINS: Record<
    rollupConfigType['projectType'],
    (c: rollupConfigType) => rollupConfigType['plugin']['plugins']
> = {
    ts: c => [createBabelPlugin(c)],
    react: c => [
        url({
            limit: 10000 // 10kB
        }),
        svgr({
            svgo: false,
            titleProp: true,
            ref: true
        }),
        createBabelPlugin(c)
    ]
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
                  ...DEFAULT_PLUGINS[c.projectType](c),
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

rollupTask.DEFAULT_PLUGINS = DEFAULT_PLUGINS

export default rollupTask
