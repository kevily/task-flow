import { map, isArray, assign, filter, isFunction, isBoolean } from 'lodash'
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
    protected tasks: Map<string, Omit<TaskConfigType<any, any>, 'name'>>
    constructor(config?: EngineConfigType & EC) {
        this.config = assign(
            {
                root: process.cwd(),
                workDir: 'src'
            },
            config
        )
        this.tasks = new Map()

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
        this.tasks.set(name, { task, config: assign({}, this.config, config) })
    }
    public getTaskNames() {
        return Array.from(this.tasks.keys())
    }
    public async run(c?: runConfigType): Promise<any> {
        let running = ora()
        if (!isBoolean(c?.tip)) {
            running = running.start(chalk.yellow(c?.tip || 'Task running...\n'))
        }
        const taskNames = isArray(c?.queue)
            ? filter(c?.queue, name => this.tasks.has(name))
            : this.getTaskNames()
        try {
            if (c?.sync) {
                for (let i = 0; i < taskNames.length; i++) {
                    const { task, config } = this.tasks.get(taskNames[i])
                    await task(config)
                }
            } else {
                await Promise.all(
                    map(taskNames, name => {
                        return new Promise((resolve, reject) => {
                            const { task, config } = this.tasks.get(name)
                            task(config)
                                .then(() => {
                                    resolve(true)
                                })
                                .catch(e => {
                                    reject(e)
                                })
                        })
                    })
                )
            }
            if (isFunction(c?.callback)) {
                await c.callback()
            }
            running.succeed()
        } catch (e) {
            running.fail()
        }
    }
}
