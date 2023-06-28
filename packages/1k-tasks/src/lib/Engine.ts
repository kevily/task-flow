import * as gulp from 'gulp'
import { isArray, assign, filter, isBoolean, keys, values, pick, has, size, forEach } from 'lodash'
import ora from 'ora'
import chalk from 'chalk'
import { GULP_TASK_DEFAULT_CONFIG } from './configs'
import { EngineConfigType, taskType, runConfigType } from './types'

export default class Task {
    protected config: EngineConfigType
    protected tasks: { [key: string]: () => Promise<any> }
    constructor(config?: EngineConfigType) {
        this.config = assign(GULP_TASK_DEFAULT_CONFIG, config)
        this.tasks = {}

        this.getTaskNames = this.getTaskNames.bind(this)
        this.run = this.run.bind(this)
    }
    public addInputIgnore(igore: EngineConfigType['ignore']): void {
        forEach(igore, str => {
            this.config.ignore.push(str)
        })
    }
    public setConfig(c?: EngineConfigType) {
        assign(this.config, c)
    }
    public registry<T extends taskType<Parameters<T>[0]>, C extends Parameters<T>[0]>(
        name: string,
        task: T,
        config?: C
    ): void {
        this.tasks[name] = () => task(assign({}, this.config, config))
    }
    public getTaskNames() {
        return keys(this.tasks)
    }
    public run(c?: runConfigType): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let running = ora()
            try {
                if (!isBoolean(c?.tip)) {
                    running = running.start(chalk.yellow(`${c?.tip || 'Task running...'}\n`))
                }
                const taskNames = isArray(c?.queue)
                    ? filter(c?.queue, name => has(this.tasks, name))
                    : this.getTaskNames()
                if (size(taskNames) > 0) {
                    const callback = () => {
                        c?.callback?.()
                        running.succeed()
                        resolve(true)
                    }
                    const tasks = values(pick(this.tasks, taskNames))
                    if (c?.sync) {
                        // @ts-ignore
                        gulp.series(...tasks, callback)(gulp)
                    } else {
                        // @ts-ignore
                        gulp.series(gulp.parallel(...tasks), callback)(gulp)
                    }
                }
            } catch (e) {
                running.fail(e.message)
                reject(e.message)
            }
        })
    }
}
