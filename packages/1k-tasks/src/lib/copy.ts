import { globSync } from 'glob'
import path from 'path'
import { copySync } from 'fs-extra'

interface configType {
    cwd?: string
    src: string[] | string
    dest: string
}

export default function (config: configType) {
    config = { cwd: process.cwd(), ...config }
    const files = globSync(config.src, { cwd: config.cwd, posix: true }).map(src => {
        const { dir, base } = path.parse(src)
        const destFolder = dir.replace(dir.split('/')[0], config.dest)
        return {
            src: path.join(config.cwd, src),
            dest: path.join(config.cwd, destFolder, base)
        }
    })
    for (let i = 0; i < files.length; i++) {
        const { src, dest } = files[i]
        copySync(src, dest)
    }
}
