#!/usr/bin/env node

import { GulpTask } from '../lib'
import { program } from 'commander'
import ora from 'ora'
import chalk from 'chalk'

const gulpTask = new GulpTask()

program
    .option('--ts', 'Use tsc to build(js,ts)')
    .option('--babel', 'Use babel to build(js,ts)')
    .option('--css', 'Build css,scss,pcss,less')
    .parse(process.argv)

const options = program.opts()

function runGulpTask(task?: 'ts' | 'babel' | 'css') {
    const building = ora(chalk.yellow(`task: ${task}\n`)).start()
    try {
        gulpTask[task]()
        building.succeed()
    } catch (err) {
        building.stop()
        throw new Error(err.message)
    }
}

if (options.ts) {
    runGulpTask('ts')
}
if (options.babel) {
    runGulpTask('babel')
}
if (options.css) {
    runGulpTask('css')
}
