import { resolvePackage } from '../utils'
import { spawnSync } from '../utils/spawnSync'
import inquirer from 'inquirer'
import createCz, { createCzConfig } from './createCz'

export interface czConfigType extends createCzConfig {}
export default async function cz(c: czConfigType) {
    let isRun = true
    if (!resolvePackage('commitizen') || !resolvePackage('cz-adapter-eslint')) {
        const { isInstall } = await inquirer.prompt([
            {
                name: 'isInstall',
                type: 'confirm',
                message: 'Please install commitizen，cz-adapter-eslint, running the createCz, now?'
            }
        ])
        if (isInstall) {
            await createCz(c)
        } else {
            isRun = false
        }
    }
    const commandPath = resolvePackage('commitizen/bin/git-cz')
    if (isRun && commandPath) {
        spawnSync('node', [commandPath])
    }
}
