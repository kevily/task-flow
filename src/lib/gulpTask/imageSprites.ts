import createTask from '../createTask'
import { engineConfigType } from '../Engine'
import spritesmith from 'gulp.spritesmith'
import filterFile from 'gulp-filter'
import { mergePath } from '../utils'

export interface imageSpritesConfigType extends engineConfigType {
    /**
     * @description unit -> KB，if set to 0, there is no limit。
     * @default 10
     */
    sizeLimit?: number
    imgName?: string
    cssName?: string
}

export default async function (c?: imageSpritesConfigType): Promise<any> {
    const root = c?.root || process.cwd()
    const sizeLimit = c?.sizeLimit ?? 10
    const dest = mergePath(root, c?.outputDir)
    await createTask({
        src: '**/*.png',
        cwd: mergePath(c?.root, c?.inputDir || ''),
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
