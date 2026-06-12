import type { SpawnResult } from "@snappy/node";
import type { ChildProcess } from "node:child_process";

export type Command =
  | { children: readonly string[]; description: string; label: string; mcp?: false; name: string }
  | { description: string; interactive?: true; label: string; mcp?: false; name: string; run: CommandRun };

export type CommandRun = (root: string, options: RunOptions) => Promise<RunResult> | RunResult;

export type RunOptions = {
  backgroundProcesses: ChildProcess[];
  capture: boolean;
  mcp: boolean;
  name: string;
  verbose: boolean;
};

export type RunResult = number | SpawnResult | { exitCode: number; message: string };
