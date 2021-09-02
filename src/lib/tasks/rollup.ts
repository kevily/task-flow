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
import { includes, some, isArray } from 'lodash'
import { mergePath } from '../utils'
import { engineConfigType } from '../Engine'

export interface rollupTaskConfigType extends Omit<engineConfigType, 'ignore'> {
    formats?: Array<ModuleFormat>
    external?: ExternalOption
    extraExternal?: (string | RegExp)[]
}

export default async function (c?: rollupTaskConfigType): Promise<any> {
    const root: rollupTaskConfigType['root'] = c?.root || process.cwd()
    const srcPath = mergePath(c?.inputDir || 'src', c?.input || 'index.ts')
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
        input: mergePath(root, srcPath),
        plugins: [
            styles(),
            typescript({
                tsconfig: mergePath(root, 'tsconfig.json')
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

    const output = mergePath(root, c?.outputDir)
    const formats = c?.formats || ['esm', 'cjs']
    fsExtra.removeSync(output)
    for (let index = 0; index < formats.length; index++) {
        const format = formats[index]
        await bundle.write({
            file: mergePath(output, `${srcPathInfo.name}.${format}.js`),
            format
        })
    }
    await bundle.close()
}
