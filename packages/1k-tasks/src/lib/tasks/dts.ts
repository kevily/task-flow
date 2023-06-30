import ts from 'gulp-typescript'
import { EngineConfigType } from '../types'
import { scriptSrc } from './babel'
import { mergePath, requireFile } from '../utils'
import { assign } from 'lodash'
import { GULP_TASK_DEFAULT_CONFIG } from '../configs/defaultConfig'
import runGulpTask from '../runGulpTask'
import { join } from 'path'

export interface dtsTaskConfigType extends EngineConfigType {
    configFilePath?: string
    dtsConfig?: ts.Settings
}
export const DTS_DEFAULT_CONFIG: dtsTaskConfigType = {
    ...GULP_TASK_DEFAULT_CONFIG
}

export default function dtsTask(config?: dtsTaskConfigType) {
    const c = assign({}, DTS_DEFAULT_CONFIG, config)

    const dest = mergePath(c.root, c?.outputDir)
    return runGulpTask({
        src: scriptSrc,
        cwd: mergePath(c.root, c?.workDir),
        ignore: c?.ignore,
        dest: dest,
        task(task) {
            task = task.pipe(
                ts.createProject(c?.configFilePath || join(c.root, 'tsconfig.json'), {
                    emitDeclarationOnly: true,
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
