import postcss from 'gulp-postcss'
import rename from 'gulp-rename'
import cssnano from 'cssnano'
import createTask from '../createTask'
import outputTask from '../outputTask'
import { configType } from '../Engine'
import { mergePath } from '../utils'

export interface cssTaskConfigType extends configType {
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
    let sassTask = createTask({
        src: ['**/*.sass', '**/*.scss'],
        cwd: srcCwd,
        ignore: c?.ignore
    })
    sassTask = sassTask.pipe(postcss(plugins, { parser: require('postcss-scss') }))
    sassTask = sassTask.pipe(rename({ extname: sassExt }))
    await outputTask({ task: sassTask, dest })
    // less
    // ----------------------------------------------------------------------
    let lessTask = createTask({
        src: ['**/*.less'],
        cwd: srcCwd,
        ignore: c?.ignore
    })
    lessTask = lessTask.pipe(postcss(plugins, { parser: require('postcss-less') }))
    lessTask = lessTask.pipe(rename({ extname: lessExt }))
    await outputTask({ task: lessTask, dest })
    // postcss
    // ----------------------------------------------------------------------
    let postcssTask = createTask({
        src: ['**/*.pcss', '**/*.css'],
        cwd: srcCwd,
        ignore: c?.ignore
    })
    postcssTask = postcssTask.pipe(postcss(plugins))
    postcssTask = postcssTask.pipe(rename({ extname: '.css' }))
    await outputTask({ task: postcssTask, dest })
}
