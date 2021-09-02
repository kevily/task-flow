import { removeSync } from 'fs-extra'
import { mergePath } from '../utils'
import { engineConfigType } from '../Engine'

export default async function (c?: engineConfigType): Promise<any> {
    const target = mergePath(c?.root || process.cwd(), c?.outputDir || 'dist')
    await removeSync(target)
}
