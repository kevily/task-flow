import { configType } from '../Engine'
import createTask, { createTaskArgType } from '../createTask'
import outputTask from '../outputTask'
import { mergePath } from '../utils'

export interface copyTaskConfigType extends configType {
    files: createTaskArgType['src']
}
export default async function (c?: copyTaskConfigType): Promise<any> {
    const root = c?.root || process.cwd()
    await outputTask({
        task: createTask({ src: c.files, cwd: mergePath(root, c?.inputDir), ignore: c?.ignore }),
        dest: mergePath(root, c?.outputDir)
    })
}
