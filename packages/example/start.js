const {
    dts,
    css,
    babel,
    clear,
    copy,
    rollup,
    Engine,
    eslint,
    stylelint,
    tsc,
} = require('1k-tasks/lib')

// Create gulpTask
const gulpTask = new Engine()
gulpTask.addInputIgnore(['**/ignore/**.*'])
gulpTask.registry('dts', dts)
gulpTask.registry('tsc', tsc)
gulpTask.registry('babel', babel)
gulpTask.registry('css', css)
gulpTask.registry('copy', copy, {
    files: ['**/copy/.prettierrc.js', '**/copy/.czrc', '**/copy/**/*.*'],
})
gulpTask.registry('eslint', eslint)
gulpTask.registry('stylelint', stylelint)
gulpTask.registry('clear', clear, {
    paths: ['./dist'],
    /**
     * @default process.cwd()
     */
    root: __dirname,
})
gulpTask.registry('rollup', rollup, {
    outputDir: 'dist/rollupTask',
})

// run queue
gulpTask.run({
    sync: true,
    queue: ['tsc'],
    tip: 'build: default...\n',
})
// task.run({ sync: true, queue: ['rollup'], tip: 'build: rollup...\n' })
