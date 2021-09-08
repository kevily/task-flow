import * as gulp from 'gulp'
import { SrcOptions } from 'vinyl-fs'
import sourcemaps from 'gulp-sourcemaps'
import { assign, isFunction, omit } from 'lodash'
import { GULP_TASK_DEFAULT_CONFIG } from './configs/defaultConfig'

export interface createGulpTaskArgType extends SrcOptions {
    src: string | string[]
    openSourcemap?: boolean
    dest?: string
    task?: (task: NodeJS.ReadWriteStream) => NodeJS.ReadWriteStream
}

export default function (c: createGulpTaskArgType) {
    return new Promise((resolve, reject) => {
        let task = gulp.src(
            c.src,
            assign({}, GULP_TASK_DEFAULT_CONFIG, omit(c, ['openSourcemap', 'src']))
        )
        task.on('end', () => {
            resolve(true)
        })
        task.on('error', e => {
            reject(e.message)
        })
        if (c.openSourcemap) {
            task = task.pipe(sourcemaps.init())
        }
        if (isFunction(c?.task)) {
            task = c.task(task)
        }
        if (c.openSourcemap) {
            task = task.pipe(sourcemaps.write('.', { sourceRoot: './', includeContent: false }))
        }
        if (c.dest) {
            task.pipe(gulp.dest(c.dest))
        }
    })
}
