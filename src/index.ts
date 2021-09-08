#!/usr/bin/env node

import { ts, css, babel, createCz, cz } from '../lib'
import commander = require('commander')
import gulp = require('gulp')
import ora = require('ora')
import chalk = require('chalk')

let program = commander.program.version(
    require('../package.json').version,
    '-v, --version',
    'output the current version'
)

function registry(name: string, description: string, task: any) {
    program = program.option(`--${name}`, description)
    gulp.task(name, task)
}

registry('createCz', 'crate cz config', async () => {
    await createCz()
})
registry('ts', 'Use tsc to build(js,ts)', ts)
registry('babel', 'Use babel to build(js,ts)', babel)
registry('css', 'Build css,scss,pcss,less', css)
registry('cz', 'Use cz', cz)

program.parse(process.argv)

const tasks = Object.keys(program.opts())

const running = ora(chalk.yellow('Task running...')).start()
const cb = async () => running.succeed()
// @ts-ignore
gulp.series(tasks, cb)(gulp)
