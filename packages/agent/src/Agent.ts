/* eslint-disable max-depth */
/* eslint-disable init-declarations */
/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { AiChatMessage, AiChatTool, AiChatToolCall } from "@snappy/ai";

import { _, StructuredPrompt } from "@snappy/core";
import { z } from "zod";

import type { AgentCreateInput, AgentRun, AgentStopReason, AgentStreamPart } from "./Types";

type AgentStatus = `runningTool` | `streaming` | `thinking`;

export const Agent = ({ ai, chatModel, locale, maxRounds, systemPrompt, tools }: AgentCreateInput) => {
  let stopped = false;
  const context = { isStopped: () => stopped };

  const thinkingLabels =
    locale === `ru` ? { done: `Мысль`, running: `Думаю...` } : { done: `Thought`, running: `Thinking...` };

  return {
    context,
    start: (initialMessages: AiChatMessage[]) => {
      stopped = false;
      let status: AgentStatus = `streaming`;
      const parts = { list: [] as AgentStreamPart[], wake: undefined as (() => void) | undefined };

      const push = (part: AgentStreamPart) => {
        parts.list.push(part);
        parts.wake?.();
      };

      const iterate = (async function* (): AsyncGenerator<AgentStreamPart> {
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
      })();

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

      void (async () => {
        let stopReason: AgentStopReason = `stopped`;
        let stopError = undefined as unknown;

        let messages: AiChatMessage[] = [
          { content: StructuredPrompt(systemPrompt), role: `system` },
          ...initialMessages,
        ];
        try {
          const chatTools: AiChatTool[] = _.entries(tools).flatMap(([groupName, groupTools]) =>
            _.entries(groupTools).map(([toolName, { description, schema }]) => ({
              function: {
                description: _.isString(description) ? description : StructuredPrompt(description),
                name: `${groupName}:${toolName}`,
                parameters: _.fromEntries(
                  _.entries(z.toJSONSchema(schema, { target: `draft-7` })).flatMap(([key, value]) =>
                    key === `$schema` ? [] : [[key, value] as const],
                  ),
                ),
              },
            })),
          );
          for (let round = 0; round < maxRounds; round += 1) {
            if (stopped) {
              break;
            }
            let textPhaseDone = false;
            let textPartSent = false;

            setStatus(`thinking`);
            const session = await ai.chat.completions.create({
              messages,
              model: chatModel,
              toolChoice: `auto`,
              tools: chatTools,
            });

            const { stream } = session;
            const pendingText: string[] = [];
            let textWake: (() => void) | undefined;
            let textUiClosed = false;

            const notifyText = () => {
              const wake = textWake;
              textWake = undefined;
              wake?.();
            };

            const endTextUi = () => {
              if (textUiClosed) {
                return;
              }
              textUiClosed = true;
              notifyText();
            };

            async function* textChunksForUi(): AsyncGenerator<string> {
              for (;;) {
                while (pendingText.length > 0) {
                  const next = pendingText.shift();
                  if (next !== undefined) {
                    yield next;
                  }
                }
                if (textUiClosed) {
                  return;
                }
                await new Promise<void>(resolve => {
                  textWake = resolve;
                });
              }
            }

            const completeTextPhase = (afterText: `streaming` | `thinking`) => {
              if (textPhaseDone) {
                return;
              }

              textPhaseDone = true;
              setStatus(afterText);
              if (afterText === `thinking`) {
                endTextUi();
              }
            };

            let streamedText = ``;
            let streamedToolCalls: AiChatToolCall[] | undefined;

            await (async () => {
              try {
                for await (const chunk of stream) {
                  if (stopped) {
                    return;
                  }
                  if (chunk.type === `text`) {
                    setStatus(`streaming`);
                    if (!textPartSent) {
                      textPartSent = true;
                      push({ chunks: textChunksForUi(), type: `text` });
                    }
                    streamedText += chunk.text;
                    pendingText.push(chunk.text);
                    notifyText();
                  } else if (chunk.type === `textEnd`) {
                    completeTextPhase(`thinking`);
                  } else {
                    completeTextPhase(`thinking`);
                    const { call: toolCall } = chunk;
                    streamedToolCalls = streamedToolCalls === undefined ? [toolCall] : [...streamedToolCalls, toolCall];
                  }
                }
                if (!textPhaseDone) {
                  completeTextPhase(chatTools.length > 0 ? `thinking` : `streaming`);
                }
              } finally {
                endTextUi();
              }
            })();

            if (stopped) {
              break;
            }

            await session.cost();

            if (stopped) {
              break;
            }

            const assistantMessage: AiChatMessage = {
              content: streamedText.trimEnd(),
              role: `assistant`,
              toolCalls:
                streamedToolCalls !== undefined && streamedToolCalls.length > 0 ? [...streamedToolCalls] : undefined,
            };

            messages = [...messages, assistantMessage];

            const toolCalls = assistantMessage.toolCalls ?? [];
            if (toolCalls.length === 0) {
              setStatus(`streaming`);
              stopReason = `success`;
              break;
            }
            if (chatTools.length > 0) {
              setStatus(`thinking`);
            }
            for (let toolIndex = 0; toolIndex < toolCalls.length; toolIndex += 1) {
              const toolCall = toolCalls[toolIndex];
              if (toolCall !== undefined) {
                if (stopped) {
                  break;
                }
                const [groupName, toolName] = toolCall.function.name.split(`:`);

                const tool =
                  groupName === undefined || toolName === undefined || groupName === `` || toolName === ``
                    ? undefined
                    : tools[groupName]?.[toolName];

                let result: string;
                if (tool === undefined) {
                  result = `Unknown tool: ${toolCall.function.name}`;
                } else {
                  const parsed = tool.schema.safeParse(toolCall.function.arguments);
                  if (parsed.success) {
                    setStatus(`runningTool`);
                    let resolveTool!: (value: { label: string }) => void;

                    const finished = new Promise<{ label: string }>(resolve => {
                      resolveTool = resolve;
                    });
                    push({
                      callId: toolCall.id,
                      finished,
                      label: tool.formatCall?.(parsed.data, `running`, locale) ?? ``,
                      type: `tool`,
                    });
                    try {
                      const runResult = await tool.run(parsed.data);
                      result = _.isString(runResult)
                        ? runResult
                        : `Tool "${toolCall.function.name}" failed: ${runResult.error}`;
                    } finally {
                      resolveTool({ label: tool.formatCall?.(parsed.data, `completed`, locale) ?? `` });
                    }
                    if (toolIndex < toolCalls.length - 1) {
                      setStatus(`thinking`);
                    }
                  } else {
                    result = `Invalid arguments for tool "${toolCall.function.name}": ${parsed.error.issues
                      .map(issue => {
                        const path = issue.path.join(`.`);

                        return path === `` ? issue.message : `${path}: ${issue.message}`;
                      })
                      .join(`; `)}`;
                  }
                }
                messages = [...messages, { content: result, role: `tool`, toolCallId: toolCall.id }];
              }
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
        push({ error: completed.error, messages: completed.messages, reason: completed.reason, type: `run` });
        resolveDone(completed);
      })();

      return Object.assign(iterate, { done, stop: () => (stopped = true) }) satisfies AgentRun;
    },
  };
};

export type Agent = ReturnType<typeof Agent>;
