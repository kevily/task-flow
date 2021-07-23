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
        openSourcemap?: boolean
        openCompress?: boolean
        babel?: {
            format?: 'esm' | 'auto'
        }
        ts?: {
            useBabel?: boolean
        }
    }
}

export interface createTaskOptionsType {
    src: string | string[]
}
export interface closeTaskOptinosType {
    task: any
}
export interface babelOptionsType {
    task?: any
}
