import ts from 'gulp-typescript'
import terser from 'gulp-terser'
import createTask, { createTaskArgType } from '../createTask'
import { engineConfigType } from '../Engine'
import { scriptSrc } from './babel'
import { mergePath } from '../utils'

export interface tsTaskConfigType extends engineConfigType {
    genDts?: boolean
    genJs?: boolean
    configFilePath?: string
    openSourcemap?: boolean
    openCompress?: boolean
}

export default async function (c?: tsTaskConfigType): Promise<any> {
    const root = c?.root || process.cwd()
    const configFilePath = c?.configFilePath || mergePath(root, 'tsconfig.json')
    const dest = mergePath(root, c?.outputDir)
    const config: Omit<createTaskArgType, 'task'> = {
        src: scriptSrc,
        cwd: mergePath(root, c?.inputDir),
        ignore: c?.ignore,
        dest: dest
    }
    if (c?.genDts ?? true) {
        await createTask({
            ...config,
            task(task) {
                task = task.pipe(ts.createProject(configFilePath)())
                // @ts-ignore
                return task.dts
            }
        })
    }
    if (c?.genJs) {
        await createTask({
            ...config,
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
