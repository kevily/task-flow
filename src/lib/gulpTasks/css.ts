import postcss from 'gulp-postcss'
import rename from 'gulp-rename'
import cssnano from 'cssnano'
import createGulpTask from '../createGulpTask'
import { GulpTaskConfigType } from '../GulpTaskEngine'
import { mergePath } from '../utils'
import { assign } from 'lodash'
import { GULP_TASK_DEFAULT_CONFIG } from '../configs/defaultConfig'

export interface cssTaskConfigType extends GulpTaskConfigType {
    closeCompress?: boolean
    /**
     * @description output ext
     * @default '.css'
     */
    sassExt?: '.scss' | '.sass' | '.css'
    /**
     * @description output ext
     * @default '.css'
     */
    lessExt?: '.less' | '.css'
}

export default async function (config?: cssTaskConfigType): Promise<any> {
    const c = assign({}, GULP_TASK_DEFAULT_CONFIG, config)
    const sassExt: cssTaskConfigType['sassExt'] = c?.sassExt || '.css'
    const lessExt: cssTaskConfigType['lessExt'] = c?.lessExt || '.css'
    const dest = mergePath(c.root, c?.outputDir)
    const srcCwd = mergePath(c.root, c?.workDir)
    const plugins = []
    if (!c?.closeCompress) {
        plugins.push(cssnano())
    }
    // sass
    // ----------------------------------------------------------------------
    await createGulpTask({
        src: ['**/*.sass', '**/*.scss'],
        cwd: srcCwd,
        ignore: c?.ignore,
        dest,
        task(task) {
            task = task.pipe(postcss(plugins, { parser: require('postcss-scss') }))
            task = task.pipe(rename({ extname: sassExt }))
            return task
        }
    })

    // less
    // ----------------------------------------------------------------------
    await createGulpTask({
        src: ['**/*.less'],
        cwd: srcCwd,
        ignore: c?.ignore,
        dest,
        task(task) {
            task = task.pipe(postcss(plugins, { parser: require('postcss-less') }))
            task = task.pipe(rename({ extname: lessExt }))
            return task
        }
    })
    // postcss
    // ----------------------------------------------------------------------
    await createGulpTask({
        src: ['**/*.pcss', '**/*.css'],
        cwd: srcCwd,
        ignore: c?.ignore,
        dest,
        task(task) {
            task = task.pipe(postcss(plugins))
            task = task.pipe(rename({ extname: '.css' }))
            return task
        }
    })
}
