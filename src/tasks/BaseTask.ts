import path from 'path'
import fsExtra from 'fs-extra'
import { spawnSync } from './utils/spawnSync'
import { onGenCommand } from './utils'

export interface BaseTaskConfigType {
    root?: string
}
export class BaseTask {
    public root: BaseTaskConfigType['root']
    constructor(c?: BaseTaskConfigType) {
        this.root = c.root || process.cwd()
    }
    onCreateCz(): void {
        const czrcPath = path.join(this.root, '.czrc')
        fsExtra.writeJsonSync(czrcPath, {
            path: 'cz-adapter-eslint'
        })
        spawnSync(onGenCommand(), ['add', 'commitizen', 'cz-adapter-eslint', '-D'])
    }
}
