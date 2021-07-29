import cp from 'child_process'

export function onGenCommand(): 'yarn' | 'npm' {
    try {
        cp.execSync('yarnpkg --version')
        return 'yarn'
    } catch {
        return 'npm'
    }
}
