const { Engine, ts, css, clear, copy, rollup } = require('1k-tasks')
const task = new Engine()
task.addInputIgnore(['**/ignore/**.*'])

task.registry('ts', ts)
task.registry('css', css)
task.registry('clear', clear)
task.registry('copy', copy, {
    files: ['**/copy/.prettierrc.js', '**/copy/.czrc', '**/copy/**/*.*']
})

task.registry('rollup', rollup, {
    outputDir: 'dist/rollupTask'
})

task.run({
    sync: true,
    queue: ['clear', 'ts', 'css', 'copy'],
    tip: 'build: default...\n'
})
task.run({ sync: true, queue: ['rollup'], tip: 'build: rollup...\n' })
