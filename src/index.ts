import gulp from 'gulp'
import { SrcOptions } from 'vinyl-fs'
import path from 'path'
import ts from 'gulp-typescript'
import babel from 'gulp-babel'
import terser from 'gulp-terser'
import postcss from 'gulp-postcss'
import sass from 'gulp-sass'
// @ts-ignore
import less from 'gulp-less'
// @ts-ignore
import cssnano from 'cssnano'

export interface paramsType {
    root?: string
    output?: string
}

class Task {
    public root: paramsType['root']
    public srcRoot: string
    public scriptSrc: string[]
    public output: paramsType['output']
    public ignore: string[]
    public srcDefaultOps: SrcOptions
    constructor(params: paramsType) {
        this.root = params?.root || process.cwd()
        this.srcRoot = path.join(this.root, 'src')
        this.scriptSrc = ['ts', 'js', 'tsx', 'jsx'].map(s => `**/*.${s}`)
        this.output = params?.output || path.join(this.root, 'dist')
        this.ignore = [
            path.join(this.root, `**/node_modules/**/*.*`),
            path.join(this.root, `**/demo/**/*.*`),
            path.join(this.root, `**/__tests__/**/*.*`)
        ]
        this.srcDefaultOps = {
            ignore: this.ignore,
            cwd: path.join(this.root, 'src')
        }
    }
    createTask(src: any) {
        return gulp.src(src, this.srcDefaultOps)
    }
    taskEnd(task: any) {
        return task.pipe(gulp.dest(this.output))
    }
    ts() {
        const tsProject = ts.createProject(path.join(this.root, 'tsconfig.json'))
        const tsTask = this.createTask(this.scriptSrc).pipe(tsProject())
        tsTask.js.pipe(terser()).pipe(gulp.dest(this.output))
        return this.taskEnd(tsTask.dts)
    }
    babel() {
        let task = this.createTask(this.scriptSrc)
        task = task.pipe(
            babel({
                presets: ['@babel/preset-typescript', '@babel/preset-env'],
                plugins: ['@babel/plugin-transform-runtime']
            })
        )
        return this.taskEnd(task.pipe(terser()))
    }
    postcss() {
        const plugins = [cssnano()]
        // sass,scss
        // ----------------------------------------------------------------------
        let sassTask = this.createTask(['**/*.sass', '**/*.scss'])
            .pipe(sass(require('sass'))())
            .pipe(postcss(plugins))
        this.taskEnd(sassTask)
        // less
        // ----------------------------------------------------------------------
        let lessTask = this.createTask(['**/*.less']).pipe(less()).pipe(postcss(plugins))
        this.taskEnd(lessTask)
        // css,pcss
        // ----------------------------------------------------------------------
        let postcssTask = this.createTask(['**/*.pcss', '**/*.css']).pipe(postcss(plugins))
        return this.taskEnd(postcssTask)
    }
    copy(ext: string[]) {
        const files = ext.map(s => `**/*.${s}`)
        return this.taskEnd(this.createTask(files))
    }
}

export { Task }
