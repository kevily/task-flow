import * as fs from 'fs'
import * as fsExtra from 'fs-extra'
import * as chalk from 'chalk'
import { onGenCommand } from '../utils'
import { engineConfigType } from '../Engine'
import { spawnSync } from '../utils/spawnSync'
import { mergePath } from '../utils'

export interface createCzConfig {
    root?: engineConfigType['root']
}
export default async function (c?: createCzConfig): Promise<any> {
    const root = c?.root || process.cwd()
    const czrcPath = mergePath(root, '.czrc')
    if (fs.existsSync(czrcPath)) {
        console.log(chalk.red('The.czrc file already exists.'))
        process.exit(1)
    }
    fsExtra.writeJsonSync(czrcPath, {
        path: 'cz-adapter-eslint'
    })
    spawnSync(onGenCommand(), ['add', 'commitizen', 'cz-adapter-eslint', '-D'], {
        cwd: root
    })
}
