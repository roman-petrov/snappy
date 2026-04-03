/* eslint-disable unicorn/prevent-abbreviations */
export type CmdDefinition =
  | {
      children: readonly string[];
      description: string;
      interactive?: true;
      label: string;
      /** After the whole tree succeeds (with Done line); optional UX hint. */
      successFooter?: () => Promise<string> | string;
    }
  | { description: string; interactive?: true; label: string; run: CmdRunDef };

export type CmdRunDef =
  | { args: string[]; tool: string }
  | {
      background?: true;
      command: string;
      cwd: string;
      env?: Record<string, string>;
      openUrl?: string;
      shutdown?: { command: string };
      /** Logged once after spawn (foreground or background). */
      spawnNotice?: () => string;
      /** After a background spawn, block until this local TCP port accepts connections. */
      waitForListenPort?: number;
    }
  | { command: string }
  | { handler: `build:app-android-debug` }
  | { handler: `build:app-android` }
  | { handler: `build:app` }
  | { handler: `build:client` }
  | { handler: `build:site` }
  | { handler: `build:ssr` };
