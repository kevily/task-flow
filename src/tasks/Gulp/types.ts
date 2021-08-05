import { createTaskConfig } from '../utils/createTaskConfig'
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
    taskConfig?: Parameters<typeof createTaskConfig>[0]
}
