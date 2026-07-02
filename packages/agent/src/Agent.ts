/* eslint-disable functional/prefer-tacit */
/* eslint-disable functional/immutable-data */
/* eslint-disable init-declarations */
/* eslint-disable unicorn/try-complexity */
/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { type AiChatMessage, type AiChatStreamSegment, type AiToolCall, AiToolResult } from "@snappy/ai";
import { _, StructuredPrompt } from "@snappy/core";
import { Bilingual } from "@snappy/intl";

import type { AgentClient, AgentCreateInput, AgentRun, AgentStopReason } from "./Types";

import { AgentToolInput } from "./AgentToolInput";

type AgentStatus = `runningTool` | `streaming` | `thinking`;

export const Agent = ({ chatModel, idleAfterSuccess, locale, maxRounds, systemPrompt, tools }: AgentCreateInput) => {
  let stopped = false;
  const isStopped = () => stopped;
  let activeAppend = _.noop as (text: string) => void;
  let activeStop = _.noop;
  const appendUserText = (text: string) => activeAppend(text);

  const stop = () => {
    stopped = true;
    activeStop();
  };

  const thinkingLabels = {
    done: Bilingual.pick(locale, [`Thought`, `Мысль`]),
    running: Bilingual.pick(locale, [`Thinking...`, `Думаю...`]),
  };

  const toolsByName = _.fromEntries(
    _.entries(tools({ isStopped })).flatMap(([group, groupTools]) =>
      _.entries(groupTools).map(([name, agentTool]) => [`${group}_${name}`, agentTool]),
    ),
  );

  return {
    appendUserText,
    context: { isStopped },
    start: (initialMessages: AiChatMessage[], client: AgentClient) => {
      stopped = false;
      activeAppend = _.noop;
      activeStop = _.noop;

      let resolveDone!: (value: { error?: unknown; messages: AiChatMessage[]; reason: AgentStopReason }) => void;

      const done = new Promise<{ error?: unknown; messages: AiChatMessage[]; reason: AgentStopReason }>(resolve => {
        resolveDone = resolve;
      });

      let status: AgentStatus = `streaming`;
      let thinkingDone: PromiseWithResolvers<{ label: string }> | undefined;

      const setStatus = (next: AgentStatus) => {
        if (status === next) {
          return;
        }
        if (status === `thinking`) {
          thinkingDone?.resolve({ label: thinkingLabels.done });
          thinkingDone = undefined;
        }
        status = next;
        if (status === `thinking`) {
          thinkingDone = Promise.withResolvers<{ label: string }>();
          client.thinking(thinkingLabels.running, thinkingDone);
        }
      };

      let idleWake: (() => void) | undefined;

      const stopRun = () => {
        stopped = true;
        idleWake?.();
      };
      activeStop = stopRun;

      const consumeSegment = async (seg: AiChatStreamSegment) => {
        if (seg.type === `chat`) {
          setStatus(`streaming`);
          await client.chatStream(seg.stream);

          return;
        }

        if (seg.type === `reasoning`) {
          setStatus(`streaming`);
          await client.reasoningStream(seg.stream);

          return;
        }

        setStatus(`thinking`);
        for await (const call of seg.stream) {
          if (isStopped()) {
            return;
          }
          void call;
        }
      };

      const chatInput = chatModel.capabilities.input;

      const executeTool = async (call: AiToolCall): Promise<AiChatMessage[] | undefined> => {
        if (isStopped()) {
          return undefined;
        }

        const agentTool = toolsByName[call.toolName];
        if (agentTool === undefined) {
          return undefined;
        }

        const parsed = AgentToolInput.parse(call.argumentsJson, agentTool.inputSchema);
        if (!parsed.ok) {
          return AiToolResult.messages({ error: parsed.error }, { chatInput, toolCallId: call.toolCallId });
        }

        const input = parsed.data;

        setStatus(`runningTool`);
        const { formatCall } = agentTool;
        let badge: PromiseWithResolvers<{ label: string }> | undefined;

        if (formatCall !== undefined) {
          badge = Promise.withResolvers<{ label: string }>();
          const runningLabel = formatCall(input, `running`, locale);

          if (runningLabel.trim() !== ``) {
            client.tool({ callId: call.toolCallId, done: badge, label: runningLabel });
          }
        }

        const result = await agentTool
          .execute(input)
          .catch((error: unknown) => ({ error: error instanceof Error ? error.message : `tool_failed` }));

        if (formatCall !== undefined) {
          badge?.resolve({ label: formatCall(input, `completed`, locale) });
        }

        setStatus(`thinking`);

        return AiToolResult.messages(result, { chatInput, toolCallId: call.toolCallId });
      };

      const run = async () => {
        let stopReason: AgentStopReason = `stopped`;
        let stopError: unknown;

        let messages: AiChatMessage[] = [
          { content: StructuredPrompt(systemPrompt), role: `system` },
          ...initialMessages,
        ];

        const pendingUserTexts: string[] = [];

        const flushUser = () => {
          if (pendingUserTexts.length === 0) {
            return false;
          }
          messages = [
            ...messages,
            ...pendingUserTexts.splice(0).map((content): AiChatMessage => ({ content, role: `user` })),
          ];

          return true;
        };

        const retryAfterUser = () => {
          if (!flushUser()) {
            return false;
          }

          setStatus(`streaming`);

          return true;
        };

        const handleNoToolCalls = async () => {
          if (retryAfterUser()) {
            return `next`;
          }
          if (idleAfterSuccess === true) {
            await new Promise<void>(resolve => {
              idleWake = () => {
                idleWake = undefined;
                resolve();
              };
              if (isStopped() || pendingUserTexts.length > 0) {
                idleWake();
              }
            });
          }
          if (isStopped()) {
            return `stopped`;
          }

          return retryAfterUser() ? `next` : `done`;
        };

        const finishWithoutTools = async () => {
          const end = await handleNoToolCalls();
          if (end === `next`) {
            return false;
          }
          stopReason = end === `stopped` ? `stopped` : `success`;
          if (end === `done`) {
            setStatus(`streaming`);
          }

          return true;
        };

        activeAppend = (raw: string) => {
          const text = raw.trim();
          if (text !== ``) {
            pendingUserTexts.push(text);
            idleWake?.();
          }
        };

        try {
          for (let round = 0; round < maxRounds; round += 1) {
            if (isStopped()) {
              break;
            }
            flushUser();
            setStatus(`thinking`);

            const session = chatModel.completions({
              messages,
              reasoningEffort: `high`,
              toolChoice: `auto`,
              tools: toolsByName,
            });

            for await (const seg of session.stream(isStopped)) {
              await consumeSegment(seg);
              if (isStopped()) {
                break;
              }
            }

            if (isStopped()) {
              break;
            }

            const [assistantMessage] = await Promise.all([session.assistant(), session.cost()]);
            messages = [...messages, assistantMessage];

            const toolCalls = assistantMessage.toolCalls ?? [];
            if (toolCalls.length === 0) {
              if (await finishWithoutTools()) {
                break;
              }
            } else {
              const toolMessageGroups = await Promise.all(toolCalls.map(executeTool));
              messages = [
                ...messages,
                ...toolMessageGroups.flatMap((group: AiChatMessage[] | undefined) => group ?? []),
              ];
              setStatus(`streaming`);
            }
          }
        } catch (error) {
          stopReason = isStopped() ? `stopped` : `failed`;
          if (!isStopped()) {
            stopError = error;
          }
        }
        setStatus(`streaming`);
        activeAppend = _.noop;
        activeStop = _.noop;
        const completed = { error: stopReason === `failed` ? stopError : undefined, messages, reason: stopReason };
        resolveDone(completed);
      };

      void run();

      return { appendUserText, done, stop: stopRun } satisfies AgentRun;
    },
    stop,
  };
};

export type Agent = ReturnType<typeof Agent>;
