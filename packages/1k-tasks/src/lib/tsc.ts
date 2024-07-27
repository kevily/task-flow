import { resolvePackage, spawnSync } from './tools'
import fsExtra from 'fs-extra'
import path from 'path'

export interface tscConfigType {
    root: string
}
export default async function tsc(c?: Partial<tscConfigType>) {
    const config: tscConfigType = { root: process.cwd(), ...c }
    const commandPath = resolvePackage('typescript/bin/tsc')
    const tsconfigPath = path.join(config.root, 'tsconfig.json')
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
