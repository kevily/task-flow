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
    const { error } = cp.spawnSync(command, args, {
        ...DEFAULT_OPTION,
        ...options
    })
    if (error) {
        process.exit(1)
    }
}
