export type CoderIgnore = { list: (args: { cwd: string; globs?: string[] }) => Promise<string[]> };
