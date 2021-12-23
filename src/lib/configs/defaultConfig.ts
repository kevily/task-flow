import { GulpTaskConfigType } from '../GulpTaskEngine'
import { rollupConfigType } from '../tasks/rollup'

export const root = process.cwd()
export const GULP_TASK_DEFAULT_CONFIG: GulpTaskConfigType = {
    workDir: 'src',
    root,
    ignore: ['**/node_modules/**/*.*', '**/__tests__/**/*.*'],
    outputDir: 'dist'
}

export const ROLLUP_DEFAULT_CONFIG: rollupConfigType = {
    root,
    workDir: 'src',
    outputDir: 'dist',
    input: 'index.ts',
    formats: ['esm', 'cjs']
}
