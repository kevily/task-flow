import { rollup, ExternalOption, ModuleFormat } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import styles from 'rollup-plugin-styles'
import path = require('path')
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import url = require('@rollup/plugin-url')
import { terser } from 'rollup-plugin-terser'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import fsExtra = require('fs-extra')
import { includes, some, isArray, assign } from 'lodash'
import { mergePath } from '../utils'
import { EngineConfigType } from '../Engine'
import { ROLLUP_DEFAULT_CONFIG } from '../configs/defaultConfig'

export interface rollupConfigType extends EngineConfigType {
    /**
     * @description input file
     * @default 'index.ts'
     */
    input?: string
    /**
     * @default dist
     */
    outputDir?: string
    /**
     * @default ['esm', 'cjs']
     */
    formats?: Array<ModuleFormat>
    external?: ExternalOption
    extraExternal?: (string | RegExp)[]
}

export default async function (config?: rollupConfigType): Promise<any> {
    const c = assign({}, ROLLUP_DEFAULT_CONFIG, config)
    const srcPath = mergePath(c.workDir, c.input)
    const srcPathInfo = path.parse(srcPath)
    const bundle = await rollup({
        external:
            c?.external ||
            function (id: string): boolean {
                if (includes(id, 'inject-css.js')) {
                    return false
                }
                const ignore: (string | RegExp)[] = ['node_modules']
                if (isArray(c?.extraExternal)) {
                    ignore.push(...c?.extraExternal)
                }
                return some(ignore, k => includes(id, k))
            },
        input: mergePath(c.root, srcPath),
        plugins: [
            styles(),
            typescript({
                tsconfig: mergePath(c.root, 'tsconfig.json')
            }),
            nodeResolve(),
            commonjs(),
            babel({
                extensions: [...DEFAULT_EXTENSIONS, '.ts', 'tsx'],
                babelHelpers: 'bundled',
                exclude: /node_modules/
            }),
            url(),
            terser()
        ]
    })

    const output = mergePath(c.root, c?.outputDir)
    fsExtra.removeSync(output)
    for (let index = 0; index < c.formats.length; index++) {
        const format = c.formats[index]
        await bundle.write({
            file: mergePath(output, `${srcPathInfo.name}.${format}.js`),
            format
        })
    }
    await bundle.close()
}
