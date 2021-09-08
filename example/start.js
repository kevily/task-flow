const { Engine, ts, css, babel, clear, copy, rollup, GulpTaskEngine } = require('1k-tasks')
// const { Engine, ts, css, babel, clear, copy, rollup, GulpTaskEngine } = require('../lib')

// Create gulpTask
const gulpTask = new GulpTaskEngine()
gulpTask.addInputIgnore(['**/ignore/**.*'])
gulpTask.registry('ts', ts, {
    genJs: false
})
gulpTask.registry('babel', babel)
gulpTask.registry('css', css)
gulpTask.registry('copy', copy, {
    files: ['**/copy/.prettierrc.js', '**/copy/.czrc', '**/copy/**/*.*']
})

// Create core task.
const task = new Engine()
task.registry('clear', clear, {
    paths: ['./dist']
})
task.registry('gulpTask', gulpTask.run, {
    sync: true,
    tip: false
})
task.registry('rollup', rollup, {
    outputDir: 'dist/rollupTask'
})

// run queue
task.run({
    sync: true,
    queue: ['clear', 'gulpTask'],
    tip: 'build: default...\n'
})
task.run({ sync: true, queue: ['rollup'], tip: 'build: rollup...\n' })
