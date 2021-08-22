import { bootstrap } from 'commitizen/dist/cli/git-cz'

export default async function () {
    bootstrap(
        {
            cliPath: require.resolve('commitizen').replace(/\/commitizen\/.*/g, '/commitizen'),
            config: {
                path: require.resolve('cz-adapter-eslint')
            }
        },
        process.argv.slice(0, 2)
    )
}
