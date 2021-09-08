import { assign, omit } from 'lodash'
import rimraf, { Options } from 'rimraf'

export interface clearConfigType extends Options {
    paths: string[]
}

/**
 * @param {Object} config Inherited from rimrafOptions
 */
export default async function (config?: clearConfigType): Promise<any> {
    const c = assign<clearConfigType, clearConfigType>({ paths: [] }, config)
    for (const p of c.paths) {
        rimraf.sync(p, omit(config, ['paths']))
    }
}
