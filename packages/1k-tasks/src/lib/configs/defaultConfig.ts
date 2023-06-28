import { EngineConfigType } from '../types'

export const root = process.cwd()
export const GULP_TASK_DEFAULT_CONFIG: EngineConfigType = {
    workDir: 'src',
    root,
    ignore: ['**/node_modules/**/*.*', '**/__tests__/**/*.*'],
    outputDir: 'dist'
}
