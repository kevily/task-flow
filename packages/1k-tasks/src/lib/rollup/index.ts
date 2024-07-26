import { rollup, RollupOptions } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import del from 'rollup-plugin-delete'
import url from '@rollup/plugin-url'
import svgr from '@svgr/rollup'
import { mergePath } from '../tools'
import { rollupConfigType } from './rollup.type'
import { extensions } from './rollup.constnat'
import { createDefaultConfig, genInput } from './rollup.tool'
import { createBabelPlugin } from './rollup.babel'

async function rollupTask(config?: rollupConfigType): Promise<void> {
    const c: rollupConfigType = { ...createDefaultConfig(), ...config }
    const options = {
        input: genInput(c),
        plugins: [
            del({ targets: [c.outputDir] }),
            nodeResolve({ extensions }),
            commonjs(),
            url({
                limit: 10000 // 10kB
            }),
            svgr({ svgo: false, titleProp: true, ref: true }) as any,
            createBabelPlugin(c)
        ],
        ...c.inputOptions
    } satisfies RollupOptions
    const bundle = await rollup(options)
    await bundle.write({
        dir: mergePath(c.root, c.outputDir),
        preserveModules: true,
        ...c.outputOptions
    })
    await bundle.close()
}

export default rollupTask
