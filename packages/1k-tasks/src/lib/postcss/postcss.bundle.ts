import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import postcssNested from 'postcss-nested'
import cssnnano from 'cssnano'
import fsExtra from 'fs-extra'
import { globSync } from 'glob'
import { configType } from './postcss.type'
import path from 'path'

export async function build(config: Partial<configType>) {
    const c: configType = {
        root: process.cwd(),
        src: 'src/**/*.css',
        dest: 'dist',
        ext: '.css',
        ...config
    }
    const srcList = globSync(c.src, { cwd: c.root, posix: true })
    const destInfo = path.parse(c.dest)
    await Promise.all(
        srcList.map(async src => {
            const srcInfo = path.parse(src)
            const fullSrc = path.join(c.root, src)
            const fullDest = (() => {
                if (destInfo.dir === '') {
                    const destFolder = srcInfo.dir.replace(srcInfo.dir.split('/')[0], config.dest)
                    return path.join(c.root, destFolder, srcInfo.name + c.ext)
                }
                return path.resolve(c.root, c.dest, srcInfo.name + c.ext)
            })()
            const css = await fsExtra.readFile(fullSrc)
            const plugins: postcss.AcceptedPlugin[] = []
            if (c.autoprefixer !== false) {
                plugins.push(autoprefixer(c.autoprefixer))
            }
            if (c.postcssNested !== false) {
                plugins.push(postcssNested(c.postcssNested))
            }
            if (c.cssnnano !== false) {
                plugins.push(cssnnano(c.cssnnano))
            }
            plugins.push(...(c.plugins || []))
            const result = await postcss(plugins).process(css, {
                from: fullSrc,
                to: fullDest
            })
            await fsExtra.ensureFileSync(fullDest)
            await fsExtra.writeFile(fullDest, result.css)
        })
    )
}
