const { style, babel, clear, copy, rollup, Engine, eslint, stylelint, tsc } = require('1k-tasks')
const path = require('path')

const root = path.join(process.cwd(), 'pkg')
const task = new Engine({ root })
task.addInputIgnore(['**/ignore/**.*'])
task.registry('tsc', tsc)
task.registry('babel', babel)
task.registry('css', style, { parser: 'css' })
task.registry('scss', style, { parser: 'scss' })
task.registry('less', style, { parser: 'less' })
task.registry('postcss', style, { parser: 'postcss' })
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

// task.run({
//     sync: true,
//     queue: ['clear', 'css', 'scss', 'less', 'postcss', 'tsc', 'rollup'],
//     tip: 'build: default...\n',
// })


// style({ root, parse: 'postcss', ignore: ['**/ignore/**.*'] })
rollup({
    projectType: 'react',
    root,
    outputDir: 'dist',
    input: '**/*.{ts,tsx}',
})
