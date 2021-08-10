import * as gulp from 'gulp'
import { SrcOptions } from 'vinyl-fs'
import sourcemaps from 'gulp-sourcemaps'
import { omit } from 'lodash'

export interface createTaskArgType extends SrcOptions {
    src: string | string[]
    openSourcemap?: boolean
}

export default function createTask(c: createTaskArgType): NodeJS.ReadWriteStream {
    let task = gulp.src(c.src, {
        ignore: ['**/node_modules/**/*.*', '**/__tests__/**/*.*'],
        ...omit(c, ['openSourcemap', 'src'])
    })
    if (c.openSourcemap) {
        task = task.pipe(sourcemaps.init())
    }
    return task
}
