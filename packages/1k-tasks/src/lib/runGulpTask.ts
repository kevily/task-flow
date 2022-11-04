import * as gulp from 'gulp'
import sourcemaps from 'gulp-sourcemaps'
import { assign, isFunction, omit } from 'lodash'
import { GULP_TASK_DEFAULT_CONFIG } from './configs/defaultConfig'

type srcOptionsType = Parameters<gulp.SrcMethod>[1]
export interface runGulpTaskArgType extends srcOptionsType {
    src: string | string[]
    openSourcemap?: boolean
    dest?: string
    task?: (task: NodeJS.ReadWriteStream) => NodeJS.ReadWriteStream
}

export default function (c: runGulpTaskArgType) {
    let task = gulp.src(
        c.src,
        assign({}, GULP_TASK_DEFAULT_CONFIG, omit(c, ['openSourcemap', 'src']))
    )
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
    return task
}
