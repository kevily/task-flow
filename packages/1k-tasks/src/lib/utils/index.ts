import cp from 'child_process'
import * as path from 'path'
import * as fs from 'fs'

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

export function resolvePackage(pkg: string, paths?: string[]) {
    try {
        return require.resolve(pkg, { paths } )
    } catch {
        return false
    }
}

export function requireFile(path) {
    if (fs.existsSync(path)) {
        return require(path)
    }
    return void 0
}
