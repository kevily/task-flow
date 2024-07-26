import { globSync } from 'glob'
import { forEach, isArray, isObject, isString, map } from 'lodash'
import { mergePath } from '../tools'
import * as path from 'path'
import { rollupConfigType } from './rollup.type'

export function createDefaultConfig(): rollupConfigType {
    return {
        root: process.cwd(),
        workDir: 'src',
        outputDir: 'dist',
        input: 'index.ts',
        inputOptions: {
            external: [/\.(scss|less|css)$/, /node_modules/]
        },
        babel: {
            targets: {
                chrome: '70'
            },
            plugins: []
        },
        outputOptions: {
            format: 'esm'
        }
    }
}

export function genInput(c: rollupConfigType) {
    function relativePath(workDir: rollupConfigType['workDir']) {
        return path.relative(process.cwd(), path.join(c.root, workDir))
    }
    let input = c.input
    if (isObject(input) && !isArray()) {
        const newInput: { [entryAlias: string]: string } = {}
        forEach(input as Record<string, string>, (input, k) => {
            newInput[k] = mergePath(relativePath(c.workDir), input)
        })
        return newInput
    }
    input = map(isString(input) ? [input] : (input as string[]), input => {
        return mergePath(relativePath(c.workDir), input).replaceAll(path.sep, path.posix.sep)
    })
    return globSync(input as string[], { ignore: c.ignore })
}
