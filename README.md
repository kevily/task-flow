## task-flow

## Install

```shell
yarn 1k-tasks -D

OR

npm install 1k-tasks -D

OR

pnpm install 1k-tasks -D
```

## Use

```ts
import {Engine, ...tasks} from '1k-tasks'
const task = new Engine(<config>)
// registry
task.registry([name], [task])
// run
task.run(<config>)
// ...
```

## Use in scripts.

-   root: process.cwd()
-   inputDir: src
-   run scripts: task -h

```
Options:
  --createCz  crate cz config
  --ts        Use tsc to build(js,ts)
  --eslint    Use eslint
  --stylelint    Use stylelint
  -h, --help  display help for command
```
