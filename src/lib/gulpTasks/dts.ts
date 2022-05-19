import ts from 'gulp-typescript'
import { GulpTaskConfigType } from '../GulpTaskEngine'
import { scriptSrc } from './babel'
import { mergePath } from '../utils'
import { assign } from 'lodash'
import { GULP_TASK_DEFAULT_CONFIG } from '../configs/defaultConfig'
import runGulpTask from '../runGulpTask'

export interface tsTaskConfigType extends GulpTaskConfigType {
    configFilePath?: string
}
export const TS_DEFAULT_CONFIG: tsTaskConfigType = {
    ...GULP_TASK_DEFAULT_CONFIG
}

export default function dtsTask(config?: tsTaskConfigType) {
    const c = assign({}, TS_DEFAULT_CONFIG, config)
    const configFilePath = c?.configFilePath || mergePath(c.root, 'tsconfig.json')
    const dest = mergePath(c.root, c?.outputDir)
    return runGulpTask({
        src: scriptSrc,
        cwd: mergePath(c.root, c?.workDir),
        ignore: c?.ignore,
        dest: dest,
        task(task) {
            task = task.pipe(
                ts.createProject(configFilePath)({
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
