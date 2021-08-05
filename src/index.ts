#!/usr/bin/env node

import { GulpTask, BaseTask } from '../lib'
import * as commander from 'commander'
import * as gulp from 'gulp'
import ora = require('ora')
import chalk = require('chalk')

const gulpTask = new GulpTask()
const baseTask = new BaseTask()

let program = commander.program

function registry(name: string, description: string, task: any) {
    program = program.option(`--${name}`, description)
    gulp.task(name, task)
}

registry('createCz', 'crate cz config', async function createCz() {
    await baseTask.onCreateCz()
})
registry('ts', 'Use tsc to build(js,ts)', gulpTask.ts)
registry('babel', 'Use babel to build(js,ts)', gulpTask.babel)
registry('css', 'Build css,scss,pcss,less', gulpTask.css)

program.parse(process.argv)

const tasks = Object.keys(program.opts())

const running = ora(chalk.yellow('Task running...')).start()
// @ts-ignore
gulp.series(tasks)(gulp)
running.succeed()
