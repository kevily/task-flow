import { assign, isString, omit } from 'lodash'
import rimraf, { RimrafSyncOptions } from 'rimraf'
import { mergePath } from './tools'

export interface clearConfigType extends RimrafSyncOptions {
    paths: string[]
    /**
     * @description Since the glob.cwd does not work. so, add root is used instead.
     */
    root?: string
}

/**
 * @param {Object} config Inherited from rimrafOptions
 */
export default async function (config?: clearConfigType): Promise<any> {
    const c = assign<clearConfigType, clearConfigType>({ paths: [], root: process.cwd() }, config)
    for (const p of c.paths) {
        if (isString(c?.root) && isString(p)) {
            rimraf.sync(mergePath(c?.root, p), omit(c, ['paths', 'root']))
        }
    }
}
