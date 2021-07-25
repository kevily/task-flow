const path = require('path')
const { GulpTask } = require('../lib')
const gulp = require('gulp')

const esmTask = new GulpTask({
    outputConfig: {
        dir: 'dist/esm'
    },
    taskConfig: {
        ts: {
            useBabel: false,
            openSourcemap: true
        },
        babel: {
            format: 'esm',
            openSourcemap: true
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
        }
    }
})
defaultTask.addInputIgnore(['**/demo/**/*.*'])

function runTask(task) {
    return gulp.series(
        function clear() {
            return task.clear()
        },
        gulp.parallel(
            function ts() {
                return task.ts()
            },
            function css() {
                return task.css()
            },
            function copy() {
                return task.copy(['jpg', 'jpeg', 'gif', 'png'])
            }
        )
    )
}

exports.default = gulp.parallel(runTask(esmTask), runTask(defaultTask))
