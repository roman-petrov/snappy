import { Commands } from "./Commands";
import { Runner } from "./Runner";

type ResolveError = { error: string; ok: false };

type ResolveOk = { name: string; ok: true };

type ResolveResult = ResolveError | ResolveOk;

const resolve = (name: string): ResolveResult => {
  if (Commands.byName(name) === undefined) {
    return { error: `Unknown command: ${name}`, ok: false };
  }

  return { name, ok: true };
};

type RunResult = { exitCode: number; message: string };

const run = async (root: string, name: string, options: { mcp?: boolean } = {}): Promise<RunResult> => {
  const definition = Commands.byName(name);
  const verbose = options.mcp === true || (definition?.type === `leaf` && definition.interactive === true);

  return Runner.run(root, name, { verbose });
};

export const Execute = { resolve, run };
