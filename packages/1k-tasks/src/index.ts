#!/usr/bin/env node

import { createCz, cz, eslint, stylelint } from '../cjs'
import commander = require('commander')
import ora = require('ora')
import chalk = require('chalk')

let program = commander.program.version(
    require('../package.json').version,
    '-v, --version',
    'output the current version'
)
const taskList: Record<string, () => Promise<void>> = {}

async function registry(name: string, description: string, task: any) {
    program = program.option(`--${name}`, description)
    taskList[name] = task
}

registry('createCz', 'crate cz config', createCz)
registry('eslint', 'eslint', eslint)
registry('stylelint', 'stylelint', stylelint)
registry('cz', 'Use cz', cz)

program.parse(process.argv)

async function run() {
    const tasks = Object.keys(program.opts())
    const running = ora(chalk.yellow('Task running...')).start()
    for (const taskName of tasks) {
        await taskList[taskName]()
    }
    running.succeed()
}

run()
