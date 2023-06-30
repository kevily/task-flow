const { dts, css, babel, clear, copy, rollup, Engine, eslint, stylelint, tsc } = require('1k-tasks')

// Create gulpTask
const task = new Engine()
task.addInputIgnore(['**/ignore/**.*'])
task.registry('dts', dts)
task.registry('tsc', tsc)
task.registry('babel', babel)
task.registry('css', css)
task.registry('copy', copy, {
    files: ['**/copy/.prettierrc.js', '**/copy/.czrc', '**/copy/**/*.*'],
})
task.registry('eslint', eslint)
task.registry('stylelint', stylelint)
task.registry('clear', clear, {
    paths: ['./dist'],
    /**
     * @default process.cwd()
     */
    root: __dirname,
})
task.registry('rollup', rollup, {
    ...rollup.REACT_CONFIG,
    outputDir: 'dist/rollupTask',
})

task.run({
    sync: true,
    queue: ['dts', 'rollup'],
    tip: 'build: default...\n',
})
