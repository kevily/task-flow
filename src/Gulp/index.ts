import gulp from 'gulp'
import path from 'path'
import { removeSync } from 'fs-extra'
import {
    optionsType,
    createTaskOptionsType,
    closeTaskOptinosType,
    babelConfigType,
    tsConfigType,
    imageSpritesOptionsType
} from './types'
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
                ...options?.taskConfig?.ts
            },
            imageSprites: {
                sizeLimit: 10,
                imgName: 'sprite.png',
                cssName: 'sprite.css',
                ...options?.taskConfig?.imageSprites
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
    ts(c?: tsConfigType) {
        const config = _.assign(this.taskConfig.ts, c)
        const task: any = this.createTask({ src: scriptSrc }).pipe(
            ts.createProject(config.configPath)()
        )
        this.outputTask({ task: task.dts })
        let jsTask = task.js
        if (config.useBabel) {
            return this.babel({ task: jsTask })
        }
        if (config.openCompress) {
            jsTask = jsTask.pipe(terser())
        }
        return this.outputTask({ task: jsTask })
    }
    babel(c: babelConfigType) {
        const config = _.assign(this.taskConfig.babel, c)
        let task = config.task || this.createTask({ src: scriptSrc })
        task = task.pipe(
            babel({
                presets: [
                    '@babel/preset-typescript',
                    '@babel/preset-react',
                    [
                        '@babel/preset-env',
                        {
                            modules: config.format === 'esm' ? false : 'auto'
                        }
                    ]
                ],
                plugins: ['@babel/plugin-transform-runtime']
            })
        )
        if (config.openCompress) {
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
    imageSprites(c?: imageSpritesOptionsType) {
        const config = _.assign(this.taskConfig.imageSprites, c)
        let task = this.createTask({ src: '**/*.png' })
        if (config.sizeLimit) {
            task = task.pipe(filterFile(file => file.stat.size <= config.sizeLimit * 1024))
        }
        return this.outputTask({
            task: task.pipe(spritesmith({ imgName: config.imgName, cssName: config.cssName }))
        })
    }
    copy(ext: string[]) {
        return this.outputTask({ task: this.createTask({ src: ext.map(s => `**/*.${s}`) }) })
    }
}
