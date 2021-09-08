import ts from 'gulp-typescript'
import terser from 'gulp-terser'
import createGulpTask, { createGulpTaskArgType } from '../createGulpTask'
import { GulpTaskConfigType } from '../GulpTaskEngine'
import { scriptSrc } from './babel'
import { mergePath } from '../utils'
import { assign } from 'lodash'
import { GULP_TASK_DEFAULT_CONFIG } from '../configs/defaultConfig'

export interface tsTaskConfigType extends GulpTaskConfigType {
    genDts?: boolean
    genJs?: boolean
    configFilePath?: string
    openSourcemap?: boolean
    openCompress?: boolean
}

export default async function (config?: tsTaskConfigType): Promise<any> {
    const c = assign({}, GULP_TASK_DEFAULT_CONFIG, config)
    const configFilePath = c?.configFilePath || mergePath(c.root, 'tsconfig.json')
    const dest = mergePath(c.root, c?.outputDir)
    const tsConfig: Omit<createGulpTaskArgType, 'task'> = {
        src: scriptSrc,
        cwd: mergePath(c.root, c?.workDir),
        ignore: c?.ignore,
        dest: dest
    }
    if (c?.genDts ?? true) {
        await createGulpTask({
            ...tsConfig,
            task(task) {
                task = task.pipe(ts.createProject(configFilePath)())
                // @ts-ignore
                return task.dts
            }
        })
    }
    if (c?.genJs) {
        await createGulpTask({
            ...tsConfig,
            openSourcemap: c?.openSourcemap,
            task(task) {
                task = task.pipe(ts.createProject(configFilePath)())
                // @ts-ignore
                task = task.js
                if (c?.openCompress) {
                    task = task.pipe(terser())
                }
                return task
            }
        })
    }
}
