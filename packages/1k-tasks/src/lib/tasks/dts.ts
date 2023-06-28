import ts from 'gulp-typescript'
import { EngineConfigType } from '../types'
import { scriptSrc } from './babel'
import { mergePath, requireFile } from '../utils'
import { assign } from 'lodash'
import { GULP_TASK_DEFAULT_CONFIG } from '../configs/defaultConfig'
import runGulpTask from '../runGulpTask'

export interface dtsTaskConfigType extends EngineConfigType {
    configFilePath?: string
    dtsConfig?: ts.Settings
}
export const DTS_DEFAULT_CONFIG: dtsTaskConfigType = {
    ...GULP_TASK_DEFAULT_CONFIG
}

export default function dtsTask(config?: dtsTaskConfigType) {
    const c = assign({}, DTS_DEFAULT_CONFIG, config)
    if (!c.dtsConfig) {
        c.dtsConfig =
            requireFile(c?.configFilePath || mergePath(c.root, 'tsconfig.json'))?.compilerOptions ||
            {}
    }

    const dest = mergePath(c.root, c?.outputDir)
    return runGulpTask({
        src: scriptSrc,
        cwd: mergePath(c.root, c?.workDir),
        ignore: c?.ignore,
        dest: dest,
        task(task) {
            task = task.pipe(
                ts.createProject({
                    module: 'ESNext',
                    esModuleInterop: true,
                    jsx: 'react',
                    allowSyntheticDefaultImports: true,
                    allowJs: true,
                    target: 'es6',
                    noImplicitAny: false,
                    skipLibCheck: true,
                    moduleResolution: 'node',
                    sourceMap: false,
                    declaration: true,
                    ...c.dtsConfig
                })({
                    error: error => {
                        throw new Error(error.message)
                    }
                })
            )
            // @ts-ignore
            return task.dts
        }
    })
}
