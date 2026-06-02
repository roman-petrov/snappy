export type CommandDefinition =
  | { children: readonly string[]; description: string; interactive?: true; label: string }
  | { description: string; interactive?: true; label: string; run: CommandRun };

export type CommandRun =
  | { args: string[]; tool: string }
  | {
      background?: true;
      command: string;
      cwd: string;
      env?: Record<string, string>;
      openUrl?: string;
      shutdown?: { command: string };
    }
  | { command: string }
  | { handler: `build:admin` }
  | { handler: `build:app-android-debug` }
  | { handler: `build:app-android` }
  | { handler: `build:app` }
  | { handler: `build:server` }
  | { handler: `build:site` }
  | { handler: `build:ssr` }
  | { handler: `cert` }
  | { handler: `finish-feature` }
  | { handler: `java-format-fix` }
  | { handler: `java-format` };
