import sourcemaps from 'gulp-sourcemaps'
import * as gulp from 'gulp'

export interface outputTaskArgType {
    task: any
    dest: string
    openSourcemap?: boolean
}

export default function outputTask(c: outputTaskArgType): NodeJS.ReadWriteStream {
    let task = c.task
    if (c.openSourcemap) {
        task = task.pipe(sourcemaps.write('.', { sourceRoot: './', includeContent: false }))
    }
    return task.pipe(gulp.dest(c.dest))
}
