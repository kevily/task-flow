import { removeSync } from 'fs-extra'
import { mergePath } from '../utils'
import { configType } from '../Engine'

export default async function (c?: configType): Promise<any> {
    const target = mergePath(c?.root || process.cwd(), c?.outputDir || 'dist')
    await removeSync(target)
}
