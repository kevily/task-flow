#!/usr/bin/env node

import { createCz, cz, eslint, stylelint, Engine } from '../cjs'
import commander = require('commander')

let program = commander.program.version(
    require('../package.json').version,
    '-v, --version',
    'output the current version'
)
const task = new Engine()

async function registry(name: string, description: string, task: any) {
    program = program.option(`--${name}`, description)
    task.registry(name, task)
}

registry('createCz', 'crate cz config', createCz)
registry('eslint', 'eslint', eslint)
registry('stylelint', 'stylelint', stylelint)
registry('cz', 'Use cz', cz)

program.parse(process.argv)

task.run({
    tip: 'Task running...',
    queue: Object.keys(program.opts())
})
