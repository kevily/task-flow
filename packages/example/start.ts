import { Engine, copy, rollup, eslint, stylelint, tsc } from '1k-tasks'
import path from 'path'

const root = path.join(process.cwd(), 'pkg')
const ignore = ['**/ignore/**.*']
const dest = 'dist'
const workDir = 'src'

const task = new Engine()
task.registry('tsc', tsc, { root })
task.registry('eslint', eslint, { root })
task.registry('stylelint', stylelint, { root })
task.registry('rollup', rollup.buildReact, {
    root,
    workDir,
    outputDir: dest,
    input: '**/*.{ts,tsx}',
    ignore
})
task.registry('copy', copy, {
    cwd: root,
    src: ['**/copy/.prettierrc.js', '**/copy/.czrc', '**/copy/**/*.*', '**/**.scss'].map(p => {
        return `${workDir}/${p}`
    }),
    dest
})

task.run({
    sync: true,
    queue: ['rollup', 'copy']
})
