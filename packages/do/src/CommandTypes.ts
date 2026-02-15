/* eslint-disable unicorn/prevent-abbreviations */
export type CmdDefinition =
  | { children: readonly string[]; description: string; interactive?: true; label: string }
  | { description: string; interactive?: true; label: string; run: CmdRunDef };

export type CmdRunDef =
  | { args: string[]; silent?: true; tool: string }
  | {
      background?: true;
      command: string;
      cwd: string;
      env?: Record<string, string>;
      openUrl?: string;
      shutdown?: { command: string };
    }
  | { command: string; silent?: true }
  | { handler: `build` };
