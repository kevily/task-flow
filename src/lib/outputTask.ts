import sourcemaps from 'gulp-sourcemaps'
import * as gulp from 'gulp'

export interface outputTaskArgType {
    task: any
    dest: string
    openSourcemap?: boolean
}

export default function outputTask(c: outputTaskArgType): Promise<any> {
    return new Promise((resolve, reject) => {
        let task = c.task
        if (c.openSourcemap) {
            task = task.pipe(sourcemaps.write('.', { sourceRoot: './', includeContent: false }))
        }
        const stream = task.pipe(gulp.dest(c.dest))
        stream.on('end', () => {
            resolve(true)
        })
        stream.on('error', e => {
            reject(e.message)
        })
    })
}
