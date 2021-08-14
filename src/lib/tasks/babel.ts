import { configType } from '../Engine'
import createTask from '../createTask'
import outputTask from '../outputTask'
import { mergePath } from '../utils'
import babel from 'gulp-babel'
import terser from 'gulp-terser'

export interface babelTaskConfigType extends configType {
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
export default function (c?: babelTaskConfigType): NodeJS.ReadWriteStream {
    const root = c?.root || process.cwd()
    const dest = mergePath(root, c?.outputDir)
    let task = createTask({
        src: scriptSrc,
        openSourcemap: c?.openCompress,
        cwd: mergePath(root, c?.inputDir),
        ignore: c?.ignore
    })
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
    return outputTask({ task, openSourcemap: c?.openSourcemap, dest: dest })
}
