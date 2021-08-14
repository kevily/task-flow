// const { Engine, ts, css, babel, clear, copy, rollup } = require('1k-tasks')
const { Engine, ts, css, babel, clear, copy, rollup } = require('../lib')
const task = new Engine()
task.addInputIgnore(['**/ignore/**.*'])

task.registry('clear', clear)
task.registry('ts', ts, {
    genJs: false
})
task.registry('babel', babel)
task.registry('css', css)
task.registry('copy', copy, {
    files: ['**/copy/.prettierrc.js', '**/copy/.czrc', '**/copy/**/*.*']
})

task.registry('rollup', rollup, {
    outputDir: 'dist/rollupTask'
})

task.run({
    sync: true,
    queue: ['clear', 'ts', 'babel', 'css', 'copy'],
    tip: 'build: default...\n'
})
task.run({ sync: true, queue: ['rollup'], tip: 'build: rollup...\n' })
