import gulp from 'gulp'
import path from 'path'
import { removeSync } from 'fs-extra'
import { optionsType, createTaskOptionsType, closeTaskOptinosType } from './types'
import _ from 'lodash'
// plugins
// ----------------------------------------------------------------------
import ts from 'gulp-typescript'
import babel from 'gulp-babel'
import terser from 'gulp-terser'
import postcss from 'gulp-postcss'
import sourcemaps from 'gulp-sourcemaps'
import cssnano from 'cssnano'
import spritesmith from 'gulp.spritesmith'
import filterFile from 'gulp-filter'

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
                format: 'auto',
                ...options?.taskConfig?.babel
            },
            ts: {
                configPath: path.join(this.root, 'tsconfig.json'),
                genDts: true,
                genJs: true,
                ...options?.taskConfig?.ts
            },
            imageSprites: {
                sizeLimit: 10,
                imgName: 'sprite.png',
                cssName: 'sprite.css',
                ...options?.taskConfig?.imageSprites
            },
            copy: {
                files: [],
                ...options?.taskConfig?.copy
            }
        }

        this.addInputIgnore(['**/node_modules/**/*.*', '**/__tests__/**/*.*'])
        // bind
        // ----------------------------------------------------------------------
        this.clear = this.clear.bind(this)
        this.ts = this.ts.bind(this)
        this.babel = this.babel.bind(this)
        this.css = this.css.bind(this)
        this.imageSprites = this.imageSprites.bind(this)
        this.copy = this.copy.bind(this)
    }
    addInputIgnore(igore: string[]) {
        _.forEach(igore, str => {
            this.inputConfig.ignore.push(path.join(this.root, str))
        })
    }
    // tasks
    // ----------------------------------------------------------------------
    createTask(c: createTaskOptionsType) {
        const { ignore, dir } = this.inputConfig
        let task = gulp.src(c.src, {
            ignore,
            cwd: path.join(this.root, dir)
        })
        if (c.openSourcemap) {
            task = task.pipe(sourcemaps.init())
        }
        return task
    }
    outputTask(c: closeTaskOptinosType) {
        const { dir } = this.outputConfig
        let task = c.task
        if (c.openSourcemap) {
            task = task.pipe(sourcemaps.write('.', { sourceRoot: './', includeContent: false }))
        }
        return task.pipe(gulp.dest(path.join(this.root, dir)))
    }
    async clear() {
        const { dir } = this.outputConfig
        return await removeSync(path.join(this.root, dir))
    }
    ts(cb?: () => void) {
        const { configPath, openCompress, openSourcemap, genJs, genDts } = this.taskConfig.ts
        const task: any = this.createTask({ src: scriptSrc, openSourcemap }).pipe(
            ts.createProject(configPath)()
        )
        if (genDts) {
            this.outputTask({ task: task.dts })
        }
        if (genJs) {
            let jsTask = task.js
            if (openCompress) {
                jsTask = jsTask.pipe(terser())
            }
            this.outputTask({ task: jsTask, openSourcemap })
        }
        _.isFunction(cb) && cb()
    }
    babel() {
        const { format, openCompress, openSourcemap } = this.taskConfig.babel
        let task = this.createTask({ src: scriptSrc, openSourcemap })
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
        return this.outputTask({ task, openSourcemap })
    }
    css() {
        const plugins = [cssnano()]
        // sass
        // ----------------------------------------------------------------------
        const sassTask = this.createTask({ src: ['**/*.sass', '**/*.scss'] }).pipe(
            postcss(plugins, { parser: require('postcss-scss') })
        )
        this.outputTask({ task: sassTask })
        // less
        // ----------------------------------------------------------------------
        const lessTask = this.createTask({ src: ['**/*.less'] }).pipe(
            postcss(plugins, { parser: require('postcss-less') })
        )
        this.outputTask({ task: lessTask })
        // postcss
        // ----------------------------------------------------------------------
        const postcssTask = this.createTask({ src: ['**/*.pcss', '**/*.css'] }).pipe(
            postcss(plugins)
        )
        return this.outputTask({ task: postcssTask })
    }
    imageSprites() {
        const { sizeLimit, imgName, cssName } = this.taskConfig.imageSprites
        let task = this.createTask({ src: '**/*.png' })
        if (sizeLimit) {
            task = task.pipe(filterFile(file => file.stat.size <= sizeLimit * 1024))
        }
        return this.outputTask({
            task: task.pipe(spritesmith({ imgName, cssName }))
        })
    }
    copy() {
        const { files } = this.taskConfig.copy
        return this.outputTask({ task: this.createTask({ src: files }) })
    }
}
