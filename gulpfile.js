const { Task } = require('./lib')

const task = new Task()

exports.default = function () {
    return task.copy(['ts'])
}
