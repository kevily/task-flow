import { assign, isFunction, isObject } from 'lodash'
import * as path from 'path'

export interface taskConfigType {
    ts?: {
        configPath?: string
        genDts?: boolean
        genJs?: boolean
        openSourcemap?: boolean
        openCompress?: boolean
    }
    babel?: {
        presets?: any[]
        plugins?: any[]
        openSourcemap?: boolean
        openCompress?: boolean
    }
    imageSprites?: {
        /**
         * @description unit -> KB，if set to 0, there is no limit。
         * @default 10
         */
        sizeLimit?: number
        imgName?: string
        cssName?: string
    }
    copy?: {
        files?: string[]
    }
}

export function createDefaultTaskConfig(): taskConfigType {
    return {
        babel: {
            presets: [
                require.resolve('@babel/preset-typescript'),
                require.resolve('@babel/preset-react'),
                [
                    require.resolve('@babel/preset-env'),
                    {
                        modules: 'auto'
                    }
                ]
            ],
            plugins: [require.resolve('@babel/plugin-transform-runtime')]
        },
        ts: {
            configPath: path.join(process.cwd(), 'tsconfig.json'),
            genDts: true,
            genJs: true
        },
        imageSprites: {
            sizeLimit: 10,
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        },
        copy: {
            files: []
        }
    }
}

export function createTaskConfig(
    c?: taskConfigType | ((c?: taskConfigType) => taskConfigType)
): taskConfigType {
    const taskConfig: taskConfigType = createDefaultTaskConfig()
    if (isFunction(c)) {
        return c(taskConfig)
    }
    if (isObject(c)) {
        assign(taskConfig.babel, c?.babel)
        assign(taskConfig.ts, c?.ts)
        assign(taskConfig.imageSprites, c?.imageSprites)
        assign(taskConfig.copy, c?.copy)
    }

    return taskConfig
}
