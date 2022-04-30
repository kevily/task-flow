import { EngineConfigType } from '../Engine'
import path = require('path')
import fsExtra = require('fs-extra')
import { assign } from 'lodash'
import { resolvePackage } from '../utils'

export interface czConfigType extends EngineConfigType {}
export default async function cz(c: czConfigType) {
    if (!resolvePackage('commitizen') || !resolvePackage('cz-adapter-eslint')) {
        throw new Error('Please install commitizen and cz-adapter-eslint')
    }
    const pkgPath = path.join(c.root || process.cwd(), 'package.json')
    const pkg: { [key: string]: any } = fsExtra.readJSONSync(pkgPath)
    pkg.config = assign({}, pkg.config, {
        commitizen: {
            path: './node_modules/cz-adapter-eslint'
        }
    })
    fsExtra.writeJSONSync(pkgPath, pkg, { spaces: 4 })
}
