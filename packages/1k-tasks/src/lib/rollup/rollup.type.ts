import { OutputOptions, RollupOptions } from 'rollup'
import { RollupBabelInputPluginOptions } from '@rollup/plugin-babel'

export interface rollupConfigType {
    root: string
    workDir: string
    ignore?: string[]
    /**
     * string/array -> globs
     * obj -> path
     */
    input: RollupOptions['input']
    /**
     * @default dist
     */
    outputDir: string
    inputOptions?: Omit<RollupOptions, 'input' | 'plugins'>
    outputOptions?: Omit<OutputOptions, 'plugins' | 'dir'>
    babel?: Pick<RollupBabelInputPluginOptions, 'targets' | 'exclude' | 'plugins'>
}
