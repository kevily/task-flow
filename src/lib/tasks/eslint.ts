import { spawnSync } from '../utils/spawnSync'
import { resolvePackage } from '../utils'
import { EngineConfigType } from '../Engine'
import { assign } from 'lodash'

export interface eslintConfigType extends EngineConfigType {}
export default async function eslint(c?: eslintConfigType): Promise<any> {
    const config = assign({ root: process.cwd() }, c)
    const eslintpath = resolvePackage('eslint/bin/eslint.js')
    if (eslintpath) {
        spawnSync('node', [eslintpath, '"./src/**/*.{js,json,ts,jsx,tsx}"', '--fix'], {
            cwd: config.root
        })
    }
}
