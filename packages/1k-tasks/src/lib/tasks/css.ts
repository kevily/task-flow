import * as gulp from 'gulp'
import postcss from 'gulp-postcss'
import rename from 'gulp-rename'
import cssnano from 'cssnano'
import runGulpTask from '../runGulpTask'
import { EngineConfigType } from '../types'
import { mergePath } from '../utils'
import { assign } from 'lodash'
import { GULP_TASK_DEFAULT_CONFIG } from '../configs/defaultConfig'

export interface cssTaskConfigType extends EngineConfigType {
    closeCompress?: boolean
    /**
     * @description output ext
     * @default '.css'
     */
    sassExt?: '.scss' | '.sass' | '.css'
    /**
     * @description output ext
     * @default '.css'
     */
    lessExt?: '.less' | '.css'
}

export default function (config?: cssTaskConfigType) {
    return new Promise<boolean>((resolve, reject) => {
        try {
            const c = assign({}, GULP_TASK_DEFAULT_CONFIG, config)
            const sassExt: cssTaskConfigType['sassExt'] = c?.sassExt || '.css'
            const lessExt: cssTaskConfigType['lessExt'] = c?.lessExt || '.css'
            const dest = mergePath(c.root, c?.outputDir)
            const srcCwd = mergePath(c.root, c?.workDir)
            const plugins = []
            if (!c?.closeCompress) {
                plugins.push(cssnano())
            }
            // sass
            // ----------------------------------------------------------------------
            function sassTask() {
                return runGulpTask({
                    src: ['**/*.sass', '**/*.scss'],
                    cwd: srcCwd,
                    ignore: c?.ignore,
                    dest,
                    task(task) {
                        task = task.pipe(postcss(plugins, { parser: require('postcss-scss') }))
                        task = task.pipe(rename({ extname: sassExt }))
                        return task
                    }
                })
            }
            // less
            // ----------------------------------------------------------------------
            function lessTask() {
                return runGulpTask({
                    src: ['**/*.less'],
                    cwd: srcCwd,
                    ignore: c?.ignore,
                    dest,
                    task(task) {
                        task = task.pipe(postcss(plugins, { parser: require('postcss-less') }))
                        task = task.pipe(rename({ extname: lessExt }))
                        return task
                    }
                })
            }
            // postcss
            // ----------------------------------------------------------------------
            function postcssTask() {
                return runGulpTask({
                    src: ['**/*.pcss', '**/*.css'],
                    cwd: srcCwd,
                    ignore: c?.ignore,
                    dest,
                    task(task) {
                        task = task.pipe(postcss(plugins))
                        task = task.pipe(rename({ extname: '.css' }))
                        return task
                    }
                })
            }
            function cb() {
                resolve(true)
            }
            // @ts-ignore
            gulp.series(sassTask, lessTask, postcssTask, cb)(gulp)
        } catch (e) {
            reject(e.message)
        }
    })
}
