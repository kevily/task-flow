import runGulpTask from '../runGulpTask'
import { EngineConfigType } from '../types'
import spritesmith from 'gulp.spritesmith'
import filterFile from 'gulp-filter'
import { mergePath } from '../utils'
import { assign } from 'lodash'
import { GULP_TASK_DEFAULT_CONFIG } from '../configs/defaultConfig'

export interface imageSpritesConfigType extends EngineConfigType {
    /**
     * @description unit -> KB，if set to 0, there is no limit。
     * @default 10
     */
    sizeLimit?: number
    imgName?: string
    cssName?: string
}

export default function (config?: imageSpritesConfigType) {
    const c = assign({}, GULP_TASK_DEFAULT_CONFIG, config)
    const root = c?.root || process.cwd()
    const sizeLimit = c?.sizeLimit ?? 10
    const dest = mergePath(root, c?.outputDir)
    return runGulpTask({
        src: '**/*.png',
        cwd: mergePath(c?.root, c?.workDir || ''),
        ignore: c?.ignore,
        dest,
        task(task) {
            if (sizeLimit > 0) {
                task = task.pipe(filterFile(file => file.stat.size <= sizeLimit * 1024))
            }
            return task.pipe(
                spritesmith({
                    imgName: c?.imgName || 'sprite.png',
                    cssName: c?.cssName || 'sprite.css'
                })
            )
        }
    })
}
