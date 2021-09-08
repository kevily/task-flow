import Engine, { EngineConfigType } from './Engine'
import { assign, forEach } from 'lodash'
import * as gulpTask from './gulpTasks'
import { GULP_TASK_DEFAULT_CONFIG } from './configs/defaultConfig'

export interface GulpTaskConfigType extends EngineConfigType {
    ignore?: string[]
    outputDir?: string
}
class GulpTaskEngine extends Engine<GulpTaskConfigType> {
    static ts = gulpTask.ts
    static babel = gulpTask.babel
    static css = gulpTask.css
    static copy = gulpTask.copy
    static imageSprites = gulpTask.imageSprites
    constructor(config?: GulpTaskConfigType) {
        super(assign({}, GULP_TASK_DEFAULT_CONFIG, config))
    }
    public addInputIgnore(igore: GulpTaskConfigType['ignore']): void {
        forEach(igore, str => {
            this.config.ignore.push(str)
        })
    }
    public setConfig(c?: GulpTaskConfigType) {
        assign(this.config, c)
    }
}

export default GulpTaskEngine
