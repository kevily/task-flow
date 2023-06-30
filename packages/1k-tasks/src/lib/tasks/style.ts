import postcss from 'gulp-postcss'
import rename from 'gulp-rename'
import cssnano from 'cssnano'
import runGulpTask from '../runGulpTask'
import { EngineConfigType } from '../types'
import { mergePath } from '../utils'
import { concat } from 'lodash'
import { GULP_TASK_DEFAULT_CONFIG } from '../configs/defaultConfig'
import GulpPostCss from 'gulp-postcss'

export interface styleTaskConfigType extends EngineConfigType {
    closeCompress?: boolean
    /**
     * @default '.css'
     */
    outputExt?: '.scss' | '.sass' | '.less' | 'pcss' | '.css'
    /**
     * @default css
     */
    parser: 'scss' | 'less' | 'postcss' | 'css'
}

function genPostcssOptions(c?: styleTaskConfigType) {
    const options: GulpPostCss.Options = {}
    switch (c.parser) {
        case 'scss':
            options.parser = require('postcss-scss')
            break
        case 'less':
            options.parser = require('postcss-less')
            break
        default:
    }
    return options
}
function genSrc(c?: styleTaskConfigType) {
    let src: string[] = ['**/*.css']
    switch (c.parser) {
        case 'scss':
            src = concat(src, ['**/*.sass', '**/*.scss'])
            break
        case 'less':
            src = concat(src, ['**/*.less'])
            break
        case 'postcss':
            src = concat(src, ['**/*.pcss'])
            break
        default:
            break
    }
    return src
}

export default function (config?: styleTaskConfigType): ReturnType<typeof runGulpTask> {
    const c: styleTaskConfigType = {
        ...GULP_TASK_DEFAULT_CONFIG,
        parser: 'css',
        outputExt: '.css',
        ...config
    }
    const plugins: any[] = []
    if (!c?.closeCompress) {
        plugins.push(cssnano())
    }
    return runGulpTask({
        src: genSrc(c),
        cwd: mergePath(c.root, c?.workDir),
        ignore: c?.ignore,
        dest: mergePath(c.root, c?.outputDir),
        task(task) {
            task = task.pipe(postcss(plugins, genPostcssOptions(c)))
            task = task.pipe(rename({ extname: c.outputExt }))
            return task
        }
    })
}
