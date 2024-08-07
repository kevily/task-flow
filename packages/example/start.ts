import { Engine, copy, rollup, clear, eslint, stylelint, tsc, postcss } from '1k-tasks'
import path from 'path'

const root = path.join(process.cwd(), 'pkg')
const ignore = ['**/ignore/**.*']
const dest = 'dist'
const workDir = 'src'

const task = new Engine()
// task.registry('clear', clear, { root, paths: [dest] })
task.registry('eslint', eslint, { root })
task.registry('stylelint', stylelint, { root })
task.registry('rollup', rollup.build, {
    root,
    workDir,
    outputDir: dest,
    input: '**/*.ts',
    ignore: [...ignore, '**/react/**/*.*']
})
task.registry('rollup:react', rollup.buildReact, {
    root,
    workDir,
    outputDir: dest,
    input: '**/*.{ts,tsx}',
    ignore
})
task.registry('tsc', tsc, { root })
task.registry('postcss', postcss.build, { root, src: `${workDir}/**/*.css`, dest })
task.registry('copy', copy, {
    cwd: root,
    src: ['**/copy/.prettierrc.js', '**/copy/.czrc', '**/copy/**/*.*', '**/**.{scss,less}'].map(
        p => {
            return `${workDir}/${p}`
        }
    ),
    dest
})

task.run({ sync: true })
