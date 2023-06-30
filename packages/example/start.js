const { dts, css, babel, clear, copy, rollup, Engine, eslint, stylelint, tsc } = require('1k-tasks')
const path = require('path')

const task = new Engine({ root: path.join(process.cwd(), 'pkg') })
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
    outputDir: 'dist',
    input: '**/*.{ts,tsx}',
})

task.run({
    sync: true,
    queue: ['dts', 'rollup'],
    tip: 'build: default...\n',
})

// rollup({
//     ...rollup.REACT_CONFIG,
//     root: path.join(process.cwd(), 'pkg'),
//     outputDir: 'dist',
//     input: '**/*.{ts,tsx}',
// })
