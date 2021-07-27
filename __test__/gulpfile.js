const path = require('path')
const { GulpTask } = require('../lib')
const gulp = require('gulp')

const copyFiles = ['**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.png']

const esmTask = new GulpTask({
    outputConfig: {
        dir: 'dist/esm'
    },
    taskConfig: {
        ts: {
            openSourcemap: true
        },
        babel: {
            format: 'esm',
            openSourcemap: true
        },
        copy: {
            files: copyFiles
        }
    }
})
esmTask.addInputIgnore(['**/demo/**/*.*'])

const defaultTask = new GulpTask({
    root: process.cwd(),
    outputConfig: {
        dir: 'dist/lib'
    },
    taskConfig: {
        ts: {
            useBabel: true,
            openSourcemap: true
        },
        copy: {
            files: copyFiles
        }
    }
})
defaultTask.addInputIgnore(['**/demo/**/*.*'])

function runTask(task) {
    return gulp.series(task.clear, gulp.parallel(task.ts, task.css, task.copy))
}

exports.default = gulp.parallel(runTask(esmTask), runTask(defaultTask))
