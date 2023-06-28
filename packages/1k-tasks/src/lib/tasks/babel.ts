import { EngineConfigType } from '../types'
import runGulpTask from '../runGulpTask'
import { mergePath } from '../utils'
import babel from 'gulp-babel'
import terser from 'gulp-terser'
import { assign } from 'lodash'
import { GULP_TASK_DEFAULT_CONFIG } from '../configs/defaultConfig'

export interface babelTaskConfigType extends EngineConfigType {
    openSourcemap?: boolean
    openCompress?: boolean
    presets?: Array<any>
    plugins?: Array<any>
    extraPresets?: Array<any>
    extraPlugins?: Array<any>
    /**
     * @description Set the modules configuration for '@babel/preset-env'。
     */
    format?: 'esm' | 'auto'
}

export const scriptSrc = ['ts', 'js', 'tsx', 'jsx', 'mjs'].map(s => `**/*.${s}`)
export default function (config?: babelTaskConfigType) {
    const c = assign({}, GULP_TASK_DEFAULT_CONFIG, config)
    const dest = mergePath(c.root, c?.outputDir)
    return runGulpTask({
        src: scriptSrc,
        openSourcemap: c?.openCompress,
        cwd: mergePath(c.root, c?.workDir),
        ignore: c?.ignore,
        dest,
        task(task) {
            task = task.pipe(
                babel({
                    presets: c?.presets || [
                        require.resolve('@babel/preset-typescript'),
                        require.resolve('@babel/preset-react'),
                        [
                            require.resolve('@babel/preset-env'),
                            {
                                modules: c?.format === 'esm' ? false : 'auto'
                            }
                        ],
                        ...(c?.extraPresets || [])
                    ],
                    plugins: c?.plugins || [
                        require.resolve('@babel/plugin-transform-runtime'),
                        ...(c?.extraPlugins || [])
                    ]
                })
            )
            if (c?.openCompress) {
                task = task.pipe(terser())
            }
            return task
        }
    })
}
