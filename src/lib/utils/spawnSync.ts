import cp, { SpawnOptions } from 'child_process'

export const DEFAULT_OPTION: SpawnOptions = {
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: true
}

export function spawnSync(
    command: string,
    args?: ReadonlyArray<string>,
    options?: SpawnOptions
): void {
    const { status, error } = cp.spawnSync(command, args, {
        ...DEFAULT_OPTION,
        ...options,
        encoding: 'utf-8'
    })
    if ((status && status !== 0) || error) {
        process.exit(1)
    }
}
