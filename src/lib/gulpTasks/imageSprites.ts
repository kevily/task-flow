import createGulpTask from '../createGulpTask'
import { GulpTaskConfigType } from '../GulpTaskEngine'
import spritesmith from 'gulp.spritesmith'
import filterFile from 'gulp-filter'
import { mergePath } from '../utils'
import { assign } from 'lodash'
import { GULP_TASK_DEFAULT_CONFIG } from '../configs/defaultConfig'

export interface imageSpritesConfigType extends GulpTaskConfigType {
    /**
     * @description unit -> KB，if set to 0, there is no limit。
     * @default 10
     */
    sizeLimit?: number
    imgName?: string
    cssName?: string
}

export default async function (config?: imageSpritesConfigType): Promise<any> {
    const c = assign({}, GULP_TASK_DEFAULT_CONFIG, config)
    const root = c?.root || process.cwd()
    const sizeLimit = c?.sizeLimit ?? 10
    const dest = mergePath(root, c?.outputDir)
    await createGulpTask({
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
