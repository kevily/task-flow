import rollup, { RollupBuild, ExternalOption, ModuleFormat } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import styles from 'rollup-plugin-styles'
import path from 'path'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import url from '@rollup/plugin-url'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import fsExtra from 'fs-extra'
import ora from 'ora'
import chalk from 'chalk'
import _ from 'lodash'

export interface optionsType {
    root?: string
    inputConfig?: {
        main?: string
        external?: ExternalOption
        plugins?: Array<any>
    }
    outputConfig?: {
        formats?: Array<ModuleFormat>
        dir?: string
    }
}

export class RollupTask {
    public root: optionsType['root']
    public bundle: RollupBuild
    public inputConfig: optionsType['inputConfig']
    public outputConfig: optionsType['outputConfig']
    constructor(options?: optionsType) {
        this.root = options?.root || process.cwd()
        this.bundle = null
        this.inputConfig = {
            main: 'src/index.ts',
            external: id => {
                if (_.includes(id, 'inject-css.js')) {
                    return false
                }
                return _.some(['node_modules'], k => _.includes(id, k))
            },
            plugins: [
                styles(),
                typescript({
                    tsconfig: path.join(this.root, 'tsconfig.json'),
                    useTsconfigDeclarationDir: true
                }),
                nodeResolve(),
                commonjs(),
                babel({
                    extensions: [...DEFAULT_EXTENSIONS, '.ts', 'tsx'],
                    babelHelpers: 'bundled',
                    exclude: /node_modules/
                }),
                url(),
                terser(),
                filesize()
            ],
            ...options?.inputConfig
        }
        // output
        // ----------------------------------------------------------------------
        this.outputConfig = {
            formats: ['esm', 'cjs'],
            dir: 'lib',
            ...options?.outputConfig
        }
    }

    async onCreateRollupBuild() {
        const { plugins, external, main } = this.inputConfig
        this.bundle = await rollup.rollup({
            external,
            input: path.join(this.root, main),
            plugins
        })
    }
    async onWrite() {
        if (this.bundle === null) {
            throw new Error('Please create RollupBuild!')
        }
        const { formats, dir } = this.outputConfig
        const { name } = path.parse(this.inputConfig.main)
        const output = path.join(this.root, dir)
        fsExtra.removeSync(output)
        for (let index = 0; index < formats.length; index++) {
            const format = formats[index]
            await this.bundle.write({
                file: path.join(output, `${name}.${format}.js`),
                format
            })
        }
    }
    async onBuild(tip = 'Building...') {
        const building = ora(chalk.yellow(tip + '\n')).start()
        await this.onCreateRollupBuild()
        await this.onWrite()
        await this.bundle.close()
        building.succeed()
    }
}
