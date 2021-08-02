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
        ts?: {
            configPath?: string
            genDts?: boolean
            genJs?: boolean
            openSourcemap?: createTaskOptionsType['openSourcemap']
            openCompress?: boolean
        }
        babel?: {
            format?: 'esm' | 'auto'
            config?: {
                presets?: any[]
                plugins?: any[]
            }
            openSourcemap?: createTaskOptionsType['openSourcemap']
            openCompress?: boolean
        }
        imageSprites?: {
            /**
             * @description unit -> KB，if set to 0, there is no limit。
             * @default 10
             */
            sizeLimit?: number
            imgName?: string
            cssName?: string
        }
        copy?: {
            files?: string[]
        }
    }
}
