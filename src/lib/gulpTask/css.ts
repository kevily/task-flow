import postcss from 'gulp-postcss'
import rename from 'gulp-rename'
import cssnano from 'cssnano'
import createTask from '../createTask'
import { engineConfigType } from '../Engine'
import { mergePath } from '../utils'

export interface cssTaskConfigType extends engineConfigType {
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

export default async function (c?: cssTaskConfigType): Promise<any> {
    const root = c?.root || process.cwd()
    const sassExt: cssTaskConfigType['sassExt'] = c?.sassExt || '.css'
    const lessExt: cssTaskConfigType['lessExt'] = c?.lessExt || '.css'
    const dest = mergePath(root, c?.outputDir)
    const srcCwd = mergePath(root, c?.inputDir)
    const plugins = []
    if (!c?.closeCompress) {
        plugins.push(cssnano())
    }
    // sass
    // ----------------------------------------------------------------------
    await createTask({
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
    await createTask({
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
    await createTask({
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
