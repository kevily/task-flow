import { OutputOptions, RollupOptions, Plugin } from 'rollup'
import { RollupBabelInputPluginOptions } from '@rollup/plugin-babel'
import { Options as delPluginOptions } from 'rollup-plugin-delete'
import { Options as svgrPluginOptions } from '@svgr/rollup'
import { RollupUrlOptions as urlPluginOptions } from '@rollup/plugin-url'
import { RollupNodeResolveOptions as nodeResolvePluginOptions } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export type babelOptionsType = Pick<
    RollupBabelInputPluginOptions,
    'targets' | 'exclude' | 'plugins' | 'presets' | 'extensions' | 'include'
>

export interface delPluginOptionsType extends Omit<delPluginOptions, 'targets'> {
    targets?: ReadonlyArray<string>
}

export interface bundleConfigType {
    root: string
    workDir: string
    ignore?: string[]
    /**
     * string/array -> globs
     * obj -> path
     */
    input: RollupOptions['input']
    /** @default dist */
    outputDir: string
    inputOptions?: Omit<RollupOptions, 'input' | 'plugins'> & {
        plugins?: Plugin[]
    }
    outputOptions?: Omit<OutputOptions, 'plugins' | 'dir'>
    /** @default true */
    nodeResolve?: false | Partial<nodeResolvePluginOptions>
    /** @default true */
    commonjs?: false | Partial<Parameters<typeof commonjs>[0]>
    /** @default true */
    babel?: false | Partial<babelOptionsType>
    /** @default true */
    urlPlugin?: false | Partial<urlPluginOptions>
    /**
     * @default true
     * @description Please place other operations after the "rollup" compilation.
     * @description The path configured under "targets" will treat the path configured under "root" as the root path, and will be merged using "path.resolve".
     */
    delPlugin?: false | Partial<delPluginOptionsType>
}

export interface reactBundleConfigType extends Omit<bundleConfigType, 'babel'> {
    babel?: Partial<babelOptionsType>
    /** @default true */
    svgrPlugin?: false | Partial<svgrPluginOptions>
}
