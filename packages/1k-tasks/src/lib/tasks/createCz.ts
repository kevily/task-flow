import * as fsExtra from 'fs-extra'
import { onGenCommand, resolvePackage } from '../utils'
import { EngineConfigType } from '../types'
import { spawnSync } from '../utils/spawnSync'
import { assign, size } from 'lodash'
import * as path from 'path'

export interface createCzConfig extends EngineConfigType {}
export default async function (config?: createCzConfig): Promise<any> {
    const rootPath = config.root || process.cwd()
    const installPkgs = []
    if (!resolvePackage('commitizen')) {
        installPkgs.push('commitizen')
    }
    if (!resolvePackage('cz-adapter-eslint')) {
        installPkgs.push('cz-adapter-eslint')
    }
    if (size(installPkgs) > 0) {
        spawnSync(onGenCommand(), ['add', ...installPkgs, '-D'], {
            cwd: rootPath
        })
    }
    const pkgPath = path.join(rootPath, 'package.json')
    const pkg: { [key: string]: any } = fsExtra.readJSONSync(pkgPath)
    pkg.config = assign({}, pkg.config, {
        commitizen: {
            path: './node_modules/cz-adapter-eslint'
        }
    })
    fsExtra.writeJSONSync(pkgPath, pkg, { spaces: 4 })
}
