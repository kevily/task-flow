import { EngineConfigType } from '../types'
import runGulpTask, { runGulpTaskArgType } from '../runGulpTask'
import { mergePath } from '../utils'
import { assign } from 'lodash'
import { GULP_TASK_DEFAULT_CONFIG } from '../configs/defaultConfig'

export interface copyTaskConfigType extends EngineConfigType {
    files: runGulpTaskArgType['src']
}

export default function (config?: copyTaskConfigType) {
    const c = assign({}, GULP_TASK_DEFAULT_CONFIG, config)
    return runGulpTask({
        src: c.files,
        cwd: mergePath(c.root, c?.workDir),
        ignore: c?.ignore,
        dest: mergePath(c.root, c?.outputDir)
    })
}
