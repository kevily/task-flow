const { GulpTask, RollupTask } = require('1k-tasks')
const gulp = require('gulp')

const copyFiles = ['**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.png']

function createEsmTask() {
    const task = new GulpTask({
        outputConfig: {
            dir: 'dist/esm'
        },
        taskConfig: {
            ts: {
                genJs: false,
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
    task.addInputIgnore(['**/demo/**/*.*'])
    return gulp.series([task.ts, task.babel])
}

async function rollupTask() {
    const task = new RollupTask({
        outputConfig: {
            dir: 'dist/rullupBuild'
        }
    })
    await task.onBuild()
}

exports.default = gulp.parallel(createEsmTask(), rollupTask)
