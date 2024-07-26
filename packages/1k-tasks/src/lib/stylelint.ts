import { spawnSync, resolvePackage } from './tools'

export interface stylelintConfigType {
    root: string
    workDir: string
}
export default async function eslint(c?: Partial<stylelintConfigType>) {
    const config: stylelintConfigType = { root: process.cwd(), workDir: 'src', ...c }
    const stylelintpath = resolvePackage('stylelint/bin/stylelint.js')
    if (stylelintpath) {
        spawnSync('node', [stylelintpath, `"./${config.workDir}/**/*.{less,scss,css}"`, '--fix'], {
            cwd: config.root
        })
    }
}
