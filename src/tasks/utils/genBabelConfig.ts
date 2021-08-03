export interface babelConfigType {
    presets?: any[]
    plugins?: any[]
    overwrite?: boolean
}
export type babelFormatType = 'esm' | 'auto'
export function genBabelConfig(
    format: babelFormatType,
    config?: babelConfigType
): Omit<babelConfigType, 'overwrite'> {
    const c = {
        presets: [
            require.resolve('@babel/preset-typescript'),
            require.resolve('@babel/preset-react'),
            [
                require.resolve('@babel/preset-env'),
                {
                    modules: format === 'esm' ? false : 'auto'
                }
            ]
        ],
        plugins: [require.resolve('@babel/plugin-transform-runtime')]
    }
    if (config?.overwrite) {
        c.plugins = config.plugins
        c.presets = config.presets
    } else {
        c.presets = c.presets.concat(config?.presets || [])
        c.plugins = c.plugins.concat(config?.plugins || [])
    }
    return c
}
