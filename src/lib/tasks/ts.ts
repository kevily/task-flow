import ts from 'gulp-typescript'
import terser from 'gulp-terser'
import createTask from '../createTask'
import outputTask from '../outputTask'
import { configType } from '../Engine'
import { scriptSrc } from './babel'
import { mergePath } from '../utils'

export interface tsTaskConfigType extends configType {
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
    const task: any = createTask({
        src: scriptSrc,
        openSourcemap: c?.openSourcemap,
        cwd: mergePath(root, c?.inputDir),
        ignore: c?.ignore
    }).pipe(ts.createProject(configFilePath)())
    if (c?.genDts ?? true) {
        await outputTask({ task: task.dts, dest })
    }
    if (c?.genJs ?? true) {
        let jsTask = task.js
        if (c?.openCompress) {
            jsTask = jsTask.pipe(terser())
        }
        await outputTask({ task: jsTask, openSourcemap: c?.openSourcemap, dest })
    }
}
