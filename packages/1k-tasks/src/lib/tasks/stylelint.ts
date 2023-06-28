import { spawnSync } from '../utils/spawnSync'
import { resolvePackage } from '../utils'
import { EngineConfigType } from '../types'
import { assign } from 'lodash'

export interface stylelintConfigType extends EngineConfigType {}
export default async function eslint(c?: stylelintConfigType): Promise<any> {
    const config: stylelintConfigType = assign({ root: process.cwd(), workDir: 'src' }, c)
    const stylelintpath = resolvePackage('stylelint/bin/stylelint.js')
    if (stylelintpath) {
        spawnSync('node', [stylelintpath, `"./${config.workDir}/**/*.{less,scss,css}"`, '--fix'], {
            cwd: config.root
        })
    }
}
