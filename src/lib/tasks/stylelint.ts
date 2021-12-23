import { spawnSync } from '../utils/spawnSync'
import { resolvePackage } from '../utils'
import { EngineConfigType } from '../Engine'
import { assign } from 'lodash'

export interface stylelintConfigType extends EngineConfigType {}
export default async function eslint(c?: stylelintConfigType): Promise<any> {
    const config = assign({ root: process.cwd() }, c)
    const stylelintpath = resolvePackage('stylelint/bin/stylelint.js')
    if (stylelintpath) {
        spawnSync('node', [stylelintpath, '"./src/**/*.{less,scss,css}"', '--fix'], {
            cwd: config.root
        })
    }
}
