import gulp from 'gulp'
import { SrcOptions } from 'vinyl-fs'
import path from 'path'
import ts from 'gulp-typescript'
import babel from 'gulp-babel'

export interface paramsType {
    root?: string
    output?: string
}

function genScriptSrc(root: paramsType['root']) {
    return ['ts', 'js', 'tsx', 'jsx'].map(s => path.join(root, `src/**/*.${s}`))
}

class Task {
    public root: paramsType['root']
    public output: paramsType['output']
    public ignore: string[]
    public srcDefaultOps: SrcOptions
    constructor(params: paramsType) {
        this.root = params?.root || process.cwd()
        this.output = params?.output || path.join(this.root, 'dist')
        this.ignore = [
            path.join(this.root, `**/node_modules/**/*.*`),
            path.join(this.root, `**/demo/**/*.*`),
            path.join(this.root, `**/__tests__/**/*.*`)
        ]
        this.srcDefaultOps = {
            ignore: this.ignore,
            cwd: this.root
        }
    }
    ts(isExportJs = true) {
        const tsProject = ts.createProject(path.join(this.root, 'tsconfig.json'))
        const tsTask = gulp.src(genScriptSrc(this.root), this.srcDefaultOps).pipe(tsProject())
        if (isExportJs) {
            tsTask.js.pipe(gulp.dest(this.output))
        }
        return tsTask.dts.pipe(gulp.dest(this.output))
    }
    babel() {
        return gulp
            .src(genScriptSrc(this.root), this.srcDefaultOps)
            .pipe(
                babel({
                    presets: ['@babel/preset-typescript', '@babel/preset-env'],
                    plugins: ['@babel/plugin-transform-runtime']
                })
            )
            .pipe(gulp.dest(this.output))
    }
    copy(ext: string[]) {
        const files = ext.map(s => path.join(this.root, `src/**/*.${s}`))
        return gulp.src(files, this.srcDefaultOps).pipe(gulp.dest(this.output))
    }
}

export { Task, genScriptSrc }
