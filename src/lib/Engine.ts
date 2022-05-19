import * as gulp from 'gulp'
import { isArray, assign, filter, isBoolean, keys, values, pick, has, size } from 'lodash'
import ora from 'ora'
import chalk from 'chalk'

export interface EngineConfigType {
    root?: string
    /**
     * @description Task work dir.
     */
    workDir?: string
}

export type taskType<C> = (c?: C) => Promise<any>
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

export default class Task<EC extends { [key: string]: any }> {
    protected config: EngineConfigType & EC
    protected tasks: { [key: string]: () => Promise<any> }
    constructor(config?: EngineConfigType & EC) {
        this.config = assign(
            {
                root: process.cwd(),
                workDir: 'src'
            },
            config
        )
        this.tasks = {}

        this.getTaskNames = this.getTaskNames.bind(this)
        this.run = this.run.bind(this)
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
    public async run(c?: runConfigType): Promise<any> {
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
        }
    }
}
