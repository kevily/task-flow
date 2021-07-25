export interface createTaskOptionsType {
    src: string | string[]
    openSourcemap?: boolean
}
export interface closeTaskOptinosType {
    task: any
    openSourcemap?: createTaskOptionsType['openSourcemap']
}

// task
// ----------------------------------------------------------------------
export interface tsConfigType {
    configPath?: string
    useBabel?: boolean
    openSourcemap?: createTaskOptionsType['openSourcemap']
    openCompress?: boolean
}
export interface babelConfigType {
    task?: any
    format?: 'esm' | 'auto'
    openSourcemap?: createTaskOptionsType['openSourcemap']
    openCompress?: boolean
}
export interface imageSpritesOptionsType {
    task?: any
    /**
     * @description unit -> KB，if set to 0, there is no limit。
     * @default 10
     */
    sizeLimit?: number
    imgName?: string
    cssName?: string
}
export interface imageminOptionsType {
    task?: any
}

export interface optionsType {
    root?: string
    inputConfig?: {
        main?: string
        dir?: string
        ignore?: any[]
    }
    outputConfig?: {
        dir?: string
    }
    taskConfig?: {
        ts?: tsConfigType
        babel?: babelConfigType
        imageSprites?: imageSpritesOptionsType
    }
}
