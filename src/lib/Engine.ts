import path from 'path'
import { forEach, map, isArray, assign, filter, isFunction } from 'lodash'
import * as gulp from 'gulp'
import ora from 'ora'
import chalk from 'chalk'

export interface configType {
    root?: string
    inputDir?: string
    input?: string
    outputDir?: string
    output?: string
    ignore?: any[]
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
    config: configType
    private tasks: Map<string, Omit<TaskConfigType<any, any>, 'name'>>
    constructor(config?: configType) {
        this.config = {
            root: process.cwd(),
            inputDir: 'src',
            input: 'index.ts',
            outputDir: 'dist',
            output: 'index.js',
            ignore: ['**/node_modules/**/*.*', '**/__tests__/**/*.*'],
            ...config
        }
        this.tasks = new Map()
    }
    public addInputIgnore(igore: string[]): void {
        forEach(igore, str => {
            this.config.ignore.push(path.join(this.config.root, str))
        })
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
        const queue: any[] = map(taskNames, name => {
            const { task, config } = this.tasks.get(name)
            return async () => await task(config)
        })
        async function cb() {
            if (isFunction(c?.callback)) {
                await c.callback()
            }
            running.succeed()
        }

        if (c?.sync) {
            // @ts-ignore
            gulp.series(queue, cb)(gulp)
        } else {
            // @ts-ignore
            gulp.series(gulp.parallel(queue), cb)(gulp)
        }
    }
}
