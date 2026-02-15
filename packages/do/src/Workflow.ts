import { Commands } from "./Commands";
import { Execute } from "./Execute";

type ResolveResult = ReturnType<typeof Execute.resolve>;

const resolve = (name: string): ResolveResult => Execute.resolve(name);

const formatCommandsHelp = (): string => {
  const padEnd = 16;

  return Commands.list()
    .map(c => `  ${c.name.padEnd(padEnd)} ${c.description}`)
    .join(`\n`);
};

export const Workflow = { formatCommandsHelp, resolve };
