import path from 'path'
import fsExtra from 'fs-extra'
import { spawnSync } from './utils/spawnSync'
import { onGenCommand } from './utils'
import * as fs from 'fs'
import chalk from 'chalk'

export interface BaseTaskConfigType {
    root?: string
}
export class BaseTask {
    public root: BaseTaskConfigType['root']
    constructor(c?: BaseTaskConfigType) {
        this.root = c?.root || process.cwd()
    }
    private spawnSync(command: string, args?: ReadonlyArray<string>): void {
        spawnSync(command, args, { cwd: this.root })
    }
    public onCreateCz(): void {
        const czrcPath = path.join(this.root, '.czrc')
        if (fs.existsSync(czrcPath)) {
            console.log(chalk.red('The.czrc file already exists.'))
            process.exit(1)
        }
        fsExtra.writeJsonSync(czrcPath, {
            path: 'cz-adapter-eslint'
        })
        this.spawnSync(onGenCommand(), ['add', 'commitizen', 'cz-adapter-eslint', '-D'])
    }
}
