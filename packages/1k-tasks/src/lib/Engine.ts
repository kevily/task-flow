import { isArray, filter, isBoolean, keys, values, pick, has, size } from 'lodash'
import ora from 'ora'
import chalk from 'chalk'

export type taskType<C> = (c: C) => Promise<any> | any
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

export default class Task {
    protected tasks: { [key: string]: () => Promise<any> | any }
    constructor() {
        this.tasks = {}

        this.getTaskNames = this.getTaskNames.bind(this)
        this.run = this.run.bind(this)
    }
    public registry<T extends taskType<Parameters<T>[0]>, C extends Parameters<T>[0]>(
        name: string,
        task: T,
        config?: C
    ): void {
        this.tasks[name] = () => task(config)
    }
    public getTaskNames() {
        return keys(this.tasks)
    }
    public async run(c?: runConfigType): Promise<boolean> {
        let running = ora()
        try {
            if (!isBoolean(c?.tip)) {
                running = running.start(chalk.yellow(`${c?.tip || 'Task running...'}\n`))
            }
            const taskNames = isArray(c?.queue)
                ? filter(c?.queue, name => has(this.tasks, name))
                : this.getTaskNames()
            if (size(taskNames) > 0) {
                const tasks = values(pick(this.tasks, taskNames))
                if (c?.sync) {
                    for (const task of tasks) {
                        await task()
                    }
                } else {
                    await Promise.all(tasks.map(task => task()))
                }
                c?.callback?.()
                running.succeed()
            }
            return true
        } catch (e) {
            running.fail(e.message)
            return false
        }
    }
}
