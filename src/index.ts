import gulp from 'gulp'
import { SrcOptions } from 'vinyl-fs'
import path from 'path'
import ts from 'gulp-typescript'
import babel from 'gulp-babel'
import terser from 'gulp-terser'

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
    ts() {
        const tsProject = ts.createProject(path.join(this.root, 'tsconfig.json'))
        const tsTask = gulp.src(this.scriptSrc, this.srcDefaultOps).pipe(tsProject())
        tsTask.js.pipe(gulp.dest(this.output))
        return tsTask.dts.pipe(gulp.dest(this.output))
    }
    babel() {
        let task = gulp.src(this.scriptSrc, this.srcDefaultOps)
        task = task.pipe(
            babel({
                presets: ['@babel/preset-typescript', '@babel/preset-env'],
                plugins: ['@babel/plugin-transform-runtime']
            })
        )
        return task.pipe(gulp.dest(this.output))
    }
    copy(ext: string[]) {
        const files = ext.map(s => `**/*.${s}`)
        return gulp.src(files, this.srcDefaultOps).pipe(gulp.dest(this.output))
    }
}

export default Task
