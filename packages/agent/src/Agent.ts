/* eslint-disable functional/prefer-tacit */
/* eslint-disable functional/immutable-data */
/* eslint-disable init-declarations */
/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import type { AiChatMessage, AiChatStreamSegment, AiToolCall } from "@snappy/ai";

import { _, StructuredPrompt } from "@snappy/core";

import type { AgentTool } from "./AgentTool";
import type { AgentCreateInput, AgentRun, AgentStopReason, AgentStreamPart } from "./Types";

import { AgentToolInput } from "./AgentToolInput";

type AgentStatus = `runningTool` | `streaming` | `thinking`;

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
  const isStopped = () => stopped;
  let activeAppend = _.noop as (text: string) => void;
  let activeStop = _.noop;
  const appendUserText = (text: string) => activeAppend(text);

  const stop = () => {
    stopped = true;
    activeStop();
  };

  const thinkingLabels =
    locale === `ru` ? { done: `Мысль`, running: `Думаю...` } : { done: `Thought`, running: `Thinking...` };

  const toolsByName = _.fromEntries(
    _.entries(tools({ isStopped })).flatMap(([group, groupTools]) =>
      _.entries(groupTools).map(([name, agentTool]) => [`${group}_${name}`, agentTool]),
    ),
  );

  const toolResultContent = (result: Awaited<ReturnType<AgentTool[`execute`]>>) =>
    _.isString(result) ? result : `Tool failed: ${result.error}`;

  return {
    appendUserText,
    context: { isStopped },
    start: (initialMessages: AiChatMessage[]) => {
      stopped = false;
      activeAppend = _.noop;
      activeStop = _.noop;

      const queue: AgentStreamPart[] = [];
      let dequeueWake: (() => void) | undefined;

      const push = (part: AgentStreamPart) => {
        queue.push(part);
        dequeueWake?.();
      };

      const waitForPart = async () => {
        await new Promise<void>(resolve => {
          dequeueWake = resolve;
        });
      };

      const stream = (async function* agentParts() {
        for (;;) {
          while (queue.length > 0) {
            const part = queue.shift();
            if (part === undefined) {
              break;
            }
            yield part;
            if (part.type === `run`) {
              return;
            }
          }
          await waitForPart();
          dequeueWake = undefined;
        }
      })();

      let resolveDone!: (value: { error?: unknown; messages: AiChatMessage[]; reason: AgentStopReason }) => void;

      const done = new Promise<{ error?: unknown; messages: AiChatMessage[]; reason: AgentStopReason }>(resolve => {
        resolveDone = resolve;
      });

      let status: AgentStatus = `streaming`;
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

      let idleWake: (() => void) | undefined;

      const stopRun = () => {
        stopped = true;
        idleWake?.();
      };
      activeStop = stopRun;

      const consumeSegment = async (seg: AiChatStreamSegment) => {
        if (seg.type === `chat` || seg.type === `reasoning`) {
          setStatus(`streaming`);
          push({ stream: seg.stream, type: `model_stream`, variant: seg.type });

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

      const executeTool = async (call: AiToolCall) => {
        if (isStopped()) {
          return undefined;
        }

        const agentTool = toolsByName[call.toolName];
        if (agentTool === undefined) {
          return undefined;
        }

        const parsed = AgentToolInput.parse(call.argumentsJson, agentTool.inputSchema);
        if (!parsed.ok) {
          return { content: toolResultContent({ error: parsed.error }), role: `tool`, toolCallId: call.toolCallId };
        }

        const input = parsed.data;

        setStatus(`runningTool`);
        let finishToolBadge: ((value: { label: string }) => void) | undefined;
        const { formatCall } = agentTool;
        if (formatCall !== undefined) {
          const finished = new Promise<{ label: string }>(resolve => {
            finishToolBadge = resolve;
          });

          const runningLabel = formatCall(input, `running`, locale);
          if (runningLabel.trim() !== ``) {
            push({ callId: call.toolCallId, finished, label: runningLabel, type: `tool` });
          }
        }
        const result = await agentTool.execute(input);
        if (formatCall !== undefined) {
          finishToolBadge?.({ label: formatCall(input, `completed`, locale) });
        }

        setStatus(`thinking`);

        return { content: toolResultContent(result), role: `tool`, toolCallId: call.toolCallId };
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

            const session = ai.chat.completions.create({
              messages,
              model: chatModel,
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
              const toolMessages = await Promise.all(toolCalls.map(executeTool));
              messages = [
                ...messages,
                ...toolMessages.filter((row): row is Extract<AiChatMessage, { role: `tool` }> => row !== undefined),
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
        push({ type: `run`, ...completed });
        resolveDone(completed);
      };

      void run();

      return Object.assign(stream, { appendUserText, done, stop: stopRun }) satisfies AgentRun;
    },
    stop,
  };
};

export type Agent = ReturnType<typeof Agent>;
