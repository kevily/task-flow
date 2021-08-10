import cp from 'child_process'
import * as path from 'path'

export function onGenCommand(): 'yarn' | 'npm' {
    try {
        cp.execSync('yarnpkg --version')
        return 'yarn'
    } catch {
        return 'npm'
    }
}

export function mergePath(root: string, p: string): string {
    return path.join(root, p || '')
}
