import { GulpTaskConfigType } from '../GulpTaskEngine'
import createGulpTask, { createGulpTaskArgType } from '../createGulpTask'
import { mergePath } from '../utils'
import { assign } from 'lodash'
import { GULP_TASK_DEFAULT_CONFIG } from '../configs/defaultConfig'

export interface copyTaskConfigType extends GulpTaskConfigType {
    files: createGulpTaskArgType['src']
}

export default async function (config?: copyTaskConfigType): Promise<any> {
    const c = assign({}, GULP_TASK_DEFAULT_CONFIG, config)
    await createGulpTask({
        src: c.files,
        cwd: mergePath(c.root, c?.workDir),
        ignore: c?.ignore,
        dest: mergePath(c.root, c?.outputDir)
    })
}
