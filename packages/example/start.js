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
    paths: ['dist'],
})
task.registry('rollup', rollup, {
    projectType: 'react',
    outputDir: 'dist',
    input: '**/*.{ts,tsx}',
})

task.run({
    sync: true,
    queue: ['clear', 'rollup'],
    tip: 'build: default...\n',
})

// rollup({
//     ...rollup.REACT_CONFIG,
//     root: path.join(process.cwd(), 'pkg'),
//     outputDir: 'dist',
//     input: '**/*.{ts,tsx}',
// })
