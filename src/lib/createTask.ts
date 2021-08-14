import * as gulp from 'gulp'
import { SrcOptions } from 'vinyl-fs'
import sourcemaps from 'gulp-sourcemaps'
import { isFunction, omit } from 'lodash'

export interface createTaskArgType extends SrcOptions {
    src: string | string[]
    openSourcemap?: boolean
    dest: string
    task?: (task: NodeJS.ReadWriteStream) => NodeJS.ReadWriteStream
}

export default function (c: createTaskArgType) {
    return new Promise((resolve, reject) => {
        let task = gulp.src(c.src, {
            ignore: ['**/node_modules/**/*.*', '**/__tests__/**/*.*'],
            ...omit(c, ['openSourcemap', 'src'])
        })
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
        task.pipe(gulp.dest(c.dest))
    })
}
