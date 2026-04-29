/* eslint-disable functional/prefer-tacit */
/* eslint-disable functional/immutable-data */
/* eslint-disable func-style */
/* eslint-disable max-depth */
/* eslint-disable init-declarations */
/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { AiChatMessage } from "@snappy/ai";

import { _, StructuredPrompt } from "@snappy/core";

import type { AgentTool, AgentToolGroup } from "./AgentTool";
import type { AgentCreateInput, AgentRun, AgentStopReason, AgentStreamPart } from "./Types";

type AgentStatus = `runningTool` | `streaming` | `thinking`;

const flattenTools = (groups: Record<string, AgentToolGroup>): Record<string, AgentTool> =>
  _.fromEntries(
    _.entries(groups).flatMap(([group, groupTools]) =>
      _.entries(groupTools).map(([name, agentTool]) => [`${group}_${name}`, agentTool]),
    ),
  );

export const Agent = ({
  ai,
  chatModel,
  idleAfterSuccess,
  locale,
  maxRounds,
  systemPrompt,
  tools,
}: AgentCreateInput) => {
  let stopped = false;
  const context = { isStopped: () => stopped };

  const thinkingLabels =
    locale === `ru` ? { done: `Мысль`, running: `Думаю...` } : { done: `Thought`, running: `Thinking...` };

  const toolsByName = flattenTools(tools);

  return {
    context,
    start: (initialMessages: AiChatMessage[]) => {
      stopped = false;
      let idleWake: (() => void) | undefined;
      let status: AgentStatus = `streaming`;
      const parts = { list: [] as AgentStreamPart[], wake: undefined as (() => void) | undefined };

      const push = (part: AgentStreamPart) => {
        parts.list.push(part);
        parts.wake?.();
      };

      async function* iterate(): AsyncGenerator<AgentStreamPart> {
        for (;;) {
          if (parts.list.length === 0) {
            await new Promise<void>(resolve => {
              parts.wake = resolve;
            });
            parts.wake = undefined;
          }
          while (parts.list.length > 0) {
            const part = parts.list.shift();
            if (part === undefined) {
              continue;
            }
            yield part;
            if (part.type === `run`) {
              return;
            }
          }
        }
      }

      const iterateInstance = iterate();
      let resolveDone!: (value: { error?: unknown; messages: AiChatMessage[]; reason: AgentStopReason }) => void;

      const done = new Promise<{ error?: unknown; messages: AiChatMessage[]; reason: AgentStopReason }>(resolve => {
        resolveDone = resolve;
      });

      let thinkingEnd: ((value: { label: string }) => void) | undefined;

      const setStatus = (next: AgentStatus) => {
        if (status === next) {
          return;
        }
        if (status === `thinking`) {
          thinkingEnd?.({ label: thinkingLabels.done });
          thinkingEnd = undefined;
        }
        status = next;
        if (status === `thinking`) {
          const finished = new Promise<{ label: string }>(resolve => {
            thinkingEnd = resolve;
          });
          push({ finished, label: thinkingLabels.running, type: `thinking` });
        }
      };

      let appendUserTextImpl: (raw: string) => void = _.noop;

      async function runSession() {
        let stopReason: AgentStopReason = `stopped`;
        let stopError = undefined as unknown;

        let messages: AiChatMessage[] = [
          { content: StructuredPrompt(systemPrompt), role: `system` },
          ...initialMessages,
        ];

        const pendingUserTexts: string[] = [];

        const flushPendingUserMessages = (): boolean => {
          if (pendingUserTexts.length === 0) {
            return false;
          }
          const additions = pendingUserTexts.splice(0).map((content): AiChatMessage => ({ content, role: `user` }));

          messages = [...messages, ...additions];

          return true;
        };

        const waitForUserOrStop = async () =>
          new Promise<void>(resolve => {
            idleWake = () => {
              idleWake = undefined;
              resolve();
            };
            if (stopped || pendingUserTexts.length > 0) {
              idleWake();
            }
          });

        appendUserTextImpl = (raw: string) => {
          const trimmed = raw.trim();
          if (trimmed !== ``) {
            pendingUserTexts.push(trimmed);
            idleWake?.();
          }
        };

        try {
          for (let round = 0; round < maxRounds; round += 1) {
            if (stopped) {
              break;
            }
            flushPendingUserMessages();

            setStatus(`thinking`);
            const session = ai.chat.completions.create({
              messages,
              model: chatModel,
              reasoningEffort: `high`,
              toolChoice: `auto`,
              tools: toolsByName,
            });

            for await (const seg of session.stream(() => stopped)) {
              if (seg.type === `chat` || seg.type === `reasoning`) {
                setStatus(`streaming`);
                push({ stream: seg.stream, type: `model_stream`, variant: seg.type });
              } else if (seg.type === `tool`) {
                setStatus(`thinking`);
                for await (const call of seg.stream) {
                  if (stopped) {
                    break;
                  }
                  const agentTool = toolsByName[call.toolName];
                  const formatCall = agentTool?.formatCall;
                  if (formatCall === undefined) {
                    continue;
                  }
                  setStatus(`runningTool`);
                  let resolveTool!: (value: { label: string }) => void;

                  const finished = new Promise<{ label: string }>(resolve => {
                    resolveTool = resolve;
                  });

                  const runningLabel = formatCall(call.input, `running`, locale);
                  if (runningLabel.trim() !== ``) {
                    push({ callId: call.toolCallId, finished, label: runningLabel, type: `tool` });
                  }
                  resolveTool({ label: formatCall(call.input, `completed`, locale) });
                  setStatus(`thinking`);
                }
              }
            }

            if (stopped) {
              break;
            }

            await session.cost();

            if (stopped) {
              break;
            }

            messages = [...messages, ...(await session.messages())];

            const assistantMessage = await session.assistant();
            const toolCalls = assistantMessage.toolCalls ?? [];
            if (toolCalls.length === 0) {
              const continueIfPendingUser = () => {
                if (!flushPendingUserMessages()) {
                  return false;
                }
                setStatus(`streaming`);

                return true;
              };

              if (continueIfPendingUser()) {
                continue;
              }
              if (idleAfterSuccess === true) {
                await waitForUserOrStop();
              }
              if (stopped) {
                stopReason = `stopped`;
                break;
              }
              if (continueIfPendingUser()) {
                continue;
              }
              setStatus(`streaming`);
              stopReason = `success`;
              break;
            }
            setStatus(`streaming`);
          }
        } catch (error) {
          stopReason = stopped ? `stopped` : `failed`;
          if (!stopped) {
            stopError = error;
          }
        }
        setStatus(`streaming`);
        const completed = { error: stopReason === `failed` ? stopError : undefined, messages, reason: stopReason };
        push({ type: `run`, ...completed });
        resolveDone(completed);
      }

      void runSession();

      return Object.assign(iterateInstance, {
        appendUserText: (text: string) => appendUserTextImpl(text),
        done,
        stop: () => {
          stopped = true;
          idleWake?.();
        },
      }) satisfies AgentRun;
    },
  };
};

export type Agent = ReturnType<typeof Agent>;
