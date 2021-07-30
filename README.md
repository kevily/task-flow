## task-flow

## Install

```shell
yarn 1k-tasks -D
npm install 1k-tasks -D
```

## Use
```javascript
import {GulpTask, RollupTask, BaseTask} from '1k-tasks'
const gulpTask = new GulpTask(<config>)
const rollupTask = new RollupTask(<config>)
const baseTask = new BaseTask(<config>)
//baseTask
baseTask.createCz()
// rollup build
rollupTask.onBuild(<tip>)
// css
gulp.task()
// ts
gulp.ts()
// ...
```

## Use in scripts.
- root: ./src
- run scripts: task -h
```
Options:
  --createCz  crate cz config
  --ts        Use tsc to build(js,ts)
  --babel     Use babel to build(js,ts)
  --css       Build css,scss,pcss,less
  -h, --help  display help for command
```
