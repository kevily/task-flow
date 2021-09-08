import * as fs from 'fs'
import * as fsExtra from 'fs-extra'
import * as chalk from 'chalk'
import { onGenCommand } from '../utils'
import { EngineConfigType } from '../Engine'
import { spawnSync } from '../utils/spawnSync'
import { mergePath } from '../utils'
import { assign } from 'lodash'

export interface createCzConfig extends EngineConfigType {}
export default async function (config?: createCzConfig): Promise<any> {
    const c = assign({ root: process.cwd() }, config)
    const czrcPath = mergePath(mergePath(c.root, c?.workDir), '.czrc')
    if (fs.existsSync(czrcPath)) {
        console.log(chalk.red('The.czrc file already exists.'))
        process.exit(1)
    }
    fsExtra.writeJsonSync(czrcPath, {
        path: 'cz-adapter-eslint'
    })
    spawnSync(onGenCommand(), ['add', 'commitizen', 'cz-adapter-eslint', '-D'], {
        cwd: c.root
    })
}
