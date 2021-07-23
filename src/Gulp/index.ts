import gulp from 'gulp'
import path from 'path'
import ts from 'gulp-typescript'
import babel from 'gulp-babel'
import terser from 'gulp-terser'
import postcss from 'gulp-postcss'
import sourcemaps from 'gulp-sourcemaps'
import cssnano from 'cssnano'
import { removeSync } from 'fs-extra'
import { optionsType, createTaskOptionsType, closeTaskOptinosType, babelOptionsType } from './types'
import _ from 'lodash'

const scriptSrc = ['ts', 'js', 'tsx', 'jsx', 'mjs'].map(s => `**/*.${s}`)

export class GulpTask {
    public root: optionsType['root']
    public inputConfig: optionsType['inputConfig']
    public outputConfig: optionsType['outputConfig']
    public taskConfig: optionsType['taskConfig']
    constructor(options?: optionsType) {
        this.root = options?.root || process.cwd()
        this.inputConfig = {
            main: 'index.ts',
            dir: 'src',
            ignore: [],
            ...options?.inputConfig
        }
        this.outputConfig = {
            dir: 'dist',
            ...options?.outputConfig
        }
        this.taskConfig = {
            babel: {
                ...options?.taskConfig?.babel
            },
            ts: {
                ...options?.taskConfig?.ts
            }
        }

        this.addInputIgnore(['**/node_modules/**/*.*', '**/__tests__/**/*.*'])
    }
    addInputIgnore(igore: string[]) {
        _.forEach(igore, str => {
            this.inputConfig.ignore.push(path.join(this.root, str))
        })
    }
    // tasks
    // ----------------------------------------------------------------------
    createTask(options: createTaskOptionsType) {
        const { openSourcemap } = this.taskConfig
        const { ignore, dir } = this.inputConfig
        let task = gulp.src(options.src, {
            ignore,
            cwd: path.join(this.root, dir)
        })
        if (openSourcemap) {
            task = task.pipe(sourcemaps.init())
        }
        return task
    }
    outputTask(options: closeTaskOptinosType) {
        const { openSourcemap } = this.taskConfig
        const { dir } = this.outputConfig
        let task = options.task
        if (openSourcemap) {
            task = task.pipe(sourcemaps.write('.', { sourceRoot: './', includeContent: false }))
        }
        return task.pipe(gulp.dest(path.join(this.root, dir)))
    }
    async clear() {
        const { dir } = this.outputConfig
        return await removeSync(path.join(this.root, dir))
    }
    ts() {
        const { useBabel } = this.taskConfig.ts
        const { openCompress } = this.taskConfig
        const tsProject = ts.createProject(path.join(this.root, 'tsconfig.json'))
        const task: any = this.createTask({ src: scriptSrc }).pipe(tsProject())
        this.outputTask({ task: task.dts })
        let jsTask = task.js
        if (useBabel) {
            return this.babel({ task: jsTask })
        }
        if (openCompress) {
            jsTask = jsTask.pipe(terser())
        }
        return this.outputTask({ task: jsTask })
    }
    babel(options: babelOptionsType) {
        const { format } = this.taskConfig.babel
        const { openCompress } = this.taskConfig
        let task = options.task || this.createTask({ src: scriptSrc })
        task = task.pipe(
            babel({
                presets: [
                    '@babel/preset-typescript',
                    '@babel/preset-react',
                    [
                        '@babel/preset-env',
                        {
                            modules: format === 'esm' ? false : 'auto'
                        }
                    ]
                ],
                plugins: ['@babel/plugin-transform-runtime']
            })
        )
        if (openCompress) {
            task = task.pipe(terser())
        }
        return this.outputTask({ task })
    }
    css() {
        const plugins = [cssnano()]
        // sass
        // ----------------------------------------------------------------------
        let sassTask = this.createTask({ src: ['**/*.sass', '**/*.scss'] }).pipe(
            postcss(plugins, { parser: require('postcss-scss') })
        )
        this.outputTask({ task: sassTask })
        // less
        // ----------------------------------------------------------------------
        let lessTask = this.createTask({ src: ['**/*.less'] }).pipe(
            postcss(plugins, { parser: require('postcss-less') })
        )
        this.outputTask({ task: lessTask })
        // postcss
        // ----------------------------------------------------------------------
        let postcssTask = this.createTask({ src: ['**/*.pcss', '**/*.css'] }).pipe(postcss(plugins))
        return this.outputTask({ task: postcssTask })
    }
    copy(ext: string[]) {
        return this.outputTask({ task: this.createTask({ src: ext.map(s => `**/*.${s}`) }) })
    }
}
