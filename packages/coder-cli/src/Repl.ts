/* eslint-disable require-atomic-updates */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { Ai, AiChatMessage } from "@snappy/ai";
import type { Coder } from "@snappy/coder";

import { Unicode } from "@snappy/core";
import { Console } from "@snappy/node";
import { createInterface } from "node:readline/promises";

import type { TFunction } from "./locales";

import { StatusOutput } from "./StatusOutput";
import { Theme } from "./Theme";

const hideCursor = `${Unicode.escape}[?25l`;
const showCursor = `${Unicode.escape}[?25h`;

const run = async ({
  ai,
  chatModel,
  coder,
  projectRoot,
  t,
}: {
  ai: Ai;
  chatModel: string;
  coder: (props: Omit<Parameters<typeof Coder>[0], `locale` | `tools`>) => ReturnType<typeof Coder>;
  projectRoot: string;
  t: TFunction;
}) => {
  const session: AiChatMessage[] = [];
  const uiState = { padPromptWithEmptyLine: false };
  const cursorState = { visible: true };

  const setCursorVisible = (visible: boolean) => {
    if (cursorState.visible === visible) {
      return;
    }
    process.stdout.write(visible ? showCursor : hideCursor);
    cursorState.visible = visible;
  };
  Console.logLine(`${Theme.appName(`coder`)} ${Theme.dim(`· ${t(`repl.project`)}: ${projectRoot}`)}`);
  Console.logLine(`${Theme.dim(t(`repl.indexHint`))} ${Theme.dim(t(`repl.commands`))}\n`);

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    while (true) {
      if (uiState.padPromptWithEmptyLine) {
        Console.logLine(``);
      }
      setCursorVisible(true);
      const line = await rl.question(`› `);
      setCursorVisible(false);
      const trimmed = line.trim();
      if (trimmed === `/exit` || trimmed === `/quit`) {
        break;
      }
      if (trimmed === `/help` || trimmed === `?`) {
        Console.logLine(
          `${Theme.command(`/exit`)} — ${t(`repl.helpExit`)}\n${Theme.command(`/help`)} — ${t(`repl.helpText`)}\n${t(`repl.helpIndexing`)}\n`,
        );
        uiState.padPromptWithEmptyLine = true;
        continue;
      }
      if (trimmed === ``) {
        continue;
      }

      session.push({ content: trimmed, role: `user` });

      await (async () => {
        const output = StatusOutput();
        try {
          const engine = coder({ ai, chatModel });

          output.start();
          const agentRun = engine.start(session, {
            chatStream: async stream => {
              let text = ``;
              for await (const delta of stream) {
                output.assistantDelta(delta);
                text += delta;
              }
              output.assistantMessage(text.trimEnd());
            },
            reasoningStream: async stream => {
              for await (const delta of stream) {
                output.assistantDelta(delta);
              }
            },
            thinking: async (label, done) => {
              output.onThinkingEvent({ label, status: `running` });
              const { label: doneLabel } = await done.promise;
              output.onThinkingEvent({ label: doneLabel, status: `completed` });
            },
            tool: async part => {
              output.onToolEvent({ callId: part.callId, label: part.label, status: `running` });
              const { label } = await part.done.promise;
              output.onToolEvent({ callId: part.callId, label, status: `completed` });
            },
          });

          const result = await agentRun.done;
          session.length = 0;
          session.push(...result.messages.filter(message => message.role !== `system`));
          if (result.reason === `failed`) {
            throw result.error instanceof Error ? result.error : new Error(String(result.error));
          }
          output.succeed();
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          output.fail(message);
          throw error;
        }
      })().catch(() => {
        const last = session.at(-1);
        if (last?.role === `user`) {
          session.pop();
        }
      });
      uiState.padPromptWithEmptyLine = true;
    }
  } finally {
    setCursorVisible(true);
    rl.close();
  }
};

export const Repl = { run };
