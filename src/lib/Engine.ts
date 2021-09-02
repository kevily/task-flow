import { forEach, map, isArray, assign, filter, isFunction } from 'lodash'
import ora from 'ora'
import chalk from 'chalk'

export interface engineConfigType {
    root?: string
    inputDir?: string
    input?: string
    outputDir?: string
    output?: string
    ignore?: string[]
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
    tip?: string
    callback?: () => Promise<any>
}

export default class Task {
    private readonly config: engineConfigType
    private tasks: Map<string, Omit<TaskConfigType<any, any>, 'name'>>
    constructor(config?: engineConfigType) {
        this.config = {
            root: process.cwd(),
            inputDir: 'src',
            input: 'index.ts',
            outputDir: 'dist',
            output: 'index.js',
            ignore: ['node_modules', '__tests__'],
            ...config
        }
        this.tasks = new Map()
    }
    public addInputIgnore(igore: string[]): void {
        forEach(igore, str => {
            this.config.ignore.push(str)
        })
    }
    public setConfig(c?: engineConfigType) {
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
        const running = ora(chalk.yellow(c?.tip || 'Task running...\n')).start()
        const taskNames = isArray(c?.queue)
            ? filter(c?.queue, name => this.tasks.has(name))
            : this.getTaskNames()
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
    }
}
