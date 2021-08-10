import { configType } from '../Engine'
import createTask, { createTaskArgType } from '../createTask'
import outputTask from '../outputTask'
import { mergePath } from '../utils'

export interface copyTaskConfigType extends configType {
    files: createTaskArgType['src']
}
export default function (c?: copyTaskConfigType): NodeJS.ReadWriteStream {
    const root = c?.root || process.cwd()
    return outputTask({
        task: createTask({ src: c.files, cwd: mergePath(root, c?.inputDir), ignore: c?.ignore }),
        dest: mergePath(root, c?.outputDir)
    })
}
