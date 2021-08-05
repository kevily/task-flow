import { createTaskConfig, createDefaultTaskConfig } from '../src/tasks/utils/createTaskConfig'

test('taskConfig', () => {
    const config = createDefaultTaskConfig()
    config.babel.plugins = []
    expect(createTaskConfig({ babel: { plugins: [] } })).toEqual(config)
})

test('Func taskConfig', () => {
    const config = createDefaultTaskConfig()
    config.babel.plugins.push('test')
    expect(
        createTaskConfig(c => {
            c.babel.plugins.push('test')
            return c
        })
    ).toEqual(config)
})
