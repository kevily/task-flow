import { spawnSync, resolvePackage } from './tools'

export interface eslintConfigType {
    workDir: string
    root: string
}
export default async function eslint(c?: Partial<eslintConfigType>): Promise<any> {
    const config: eslintConfigType = { root: process.cwd(), workDir: 'src', ...c }
    const eslintpath = resolvePackage('eslint/bin/eslint.js')
    if (eslintpath) {
        spawnSync(
            'node',
            [eslintpath, `"./${config.workDir}/**/*.{js,json,ts,jsx,tsx}"`, '--fix'],
            {
                cwd: config.root
            }
        )
    }
}
