const { RollupTask } = require('./lib')
const path = require('path')
const task = new RollupTask({
    root: path.join(process.cwd(), 'design')
})

task.onBuild()
