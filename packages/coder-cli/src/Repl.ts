/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data, functional/no-expression-statements, functional/no-loop-statements, functional/no-promise-reject, functional/no-try-statements, no-await-in-loop, no-continue */
import type { AiChatMessage, AiModel } from "@snappy/ai";
import type { Coder } from "@snappy/coder";

import { Console } from "@snappy/node";
import { createInterface } from "node:readline/promises";

import type { TFunction } from "./locales";

import { StatusOutput } from "./StatusOutput";
import { Theme } from "./Theme";

const hideCursor = `\u001B[?25l`;
const showCursor = `\u001B[?25h`;

type ToolCallEvent = Parameters<NonNullable<Parameters<typeof Coder>[0][`onToolCallEvent`]>>[0];

const run = async ({
  chatModel,
  coder,
  projectRoot,
  t,
}: {
  chatModel: Extract<AiModel, { type: `chat` }>;
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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

      await new Promise<void>((resolve, reject) => {
        const output = StatusOutput({ t });
        let settled = false;

        const resolveOnce = () => {
          if (settled) {
            return;
          }
          settled = true;
          output.succeed();
          resolve();
        };

        const rejectOnce = (error: unknown) => {
          if (settled) {
            return;
          }
          settled = true;
          const message = error instanceof Error ? error.message : String(error);
          output.fail(message);
          reject(error instanceof Error ? error : new Error(message));
        };

        const handleToolCallEvent = ({ callId, label, status }: ToolCallEvent) =>
          settled ? undefined : output.onToolEvent({ callId, label, status });

        const chatModelWithStreamOutput: typeof chatModel = {
          ...chatModel,
          process: async input => {
            const { done, stream } = await chatModel.process(input);

            const doneWithOutput = (async () => {
              for await (const delta of stream) {
                if (!settled) {
                  output.assistantDelta(delta);
                }
              }

              return done;
            })();

            return { done: doneWithOutput, stream };
          },
        };

        const engine = coder({
          chatModel: chatModelWithStreamOutput,
          observeSessionMessages: snap => {
            session.length = 0;
            session.push(...snap);
          },
          onAssistantMessage: message => {
            if (settled || message.role !== `assistant`) {
              return;
            }
            output.assistantMessage(message.content);
          },
          onStop: (reason, error) => {
            if (reason === `failed`) {
              rejectOnce(error);

              return;
            }
            resolveOnce();
          },
          onToolCallEvent: handleToolCallEvent,
        });

        output.start();
        try {
          engine.start(session);
        } catch (error) {
          rejectOnce(error);
        }
      }).catch(() => {
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
