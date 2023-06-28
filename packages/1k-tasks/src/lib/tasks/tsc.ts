import { resolvePackage } from '../utils'
import { spawnSync } from '../utils/spawnSync'
import { EngineConfigType } from '../types'
import { assign } from 'lodash'
import fsExtra from 'fs-extra'
import path from 'path'

export interface tscConfigType extends EngineConfigType {}
export default async function tsc(c: tscConfigType) {
    const config: tscConfigType = assign({ root: process.cwd() }, c)
    const commandPath = resolvePackage('typescript/bin/tsc')
    const tsconfigPath = path.join(c.root, 'tsconfig.json')
    const hasTsConfig = fsExtra.existsSync(tsconfigPath)
    if (!hasTsConfig) {
        throw new Error(`The '${tsconfigPath}' is not exists!`)
    }
    if (commandPath) {
        spawnSync('node', [commandPath, '--project tsconfig.json'], {
            cwd: config.root
        })
    }
}
