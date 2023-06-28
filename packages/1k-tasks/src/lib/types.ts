export interface EngineConfigType {
    root?: string
    /**
     * @description Task work dir.
     */
    workDir?: string
    ignore?: string[]
    outputDir?: string
}

export type taskType<C> = (c?: C) => Promise<any> | any
export interface TaskConfigType<T, C> {
    name: string
    task: T
    config?: C
}
export interface runConfigType {
    sync?: boolean
    queue?: string[]
    /**
     * @description If set to false, it is not displayed
     */
    tip?: string | boolean
    callback?: () => Promise<any>
}
