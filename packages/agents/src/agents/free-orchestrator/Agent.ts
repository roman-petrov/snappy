/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
import type { AiChatMessage, AiChatTool } from "@snappy/ai";

import { type AgentAdapter, Agent as createAgentLoop } from "@snappy/agent";
import { _ } from "@snappy/core";

import type { AgentModule, AgentStartInput } from "../../Types";

import { scenarios } from "./Scenarios";
import { Start } from "./Start";
import { Storage } from "./Storage";
import { System } from "./System";
import { Tools } from "./Tools";

export const Agent: AgentModule = locale => ({
  meta: {
    description:
      locale === `ru`
        ? `Динамический агент с инструментами и пошаговой генерацией формы во время работы.`
        : `Dynamic tool-based agent with runtime form generation.`,
    emoji: `🧪`,
    group: `lab` as const,
    title: locale === `ru` ? `Свободный оркестратор` : `Free orchestrator`,
  },
  start: (input: AgentStartInput) => {
    const stopRun = { current: undefined as (() => void) | undefined };

    const run = async () => {
      const starter = await input.hostTools.ask({ component: Start, props: { options: scenarios(locale) } });

      if (input.isStopped()) {
        await input.onDone({ failed: false });

        return;
      }
      const scenarioLabel = starter.label.trim();
      const text = `Starter task message: "${scenarioLabel}". Begin the analysis and intake phase: clarify only what is needed via showStaticForm before generation, general to specific.`;
      const storage = Storage();
      const initialMessages: AiChatMessage[] = [{ content: text, role: `user` }];

      const engine = createAgentLoop(
        (context): AgentAdapter => ({
          chat: async (messages: AiChatMessage[], tools: AiChatTool[]) => {
            if (context.isStopped()) {
              return undefined;
            }
            const out = await input.hostTools.chat({ messages, toolChoice: `auto`, tools });

            return _.isString(out) ? undefined : out;
          },
          maxRounds: 8,
          onStop: async (reason, error) => {
            if (reason === `failed` && error !== undefined) {
              const html = error instanceof Error ? error.message : `unknown_error`;
              if (html.trim() !== ``) {
                input.feed.append({ generationPrompt: html, html, type: `text` });
              }
            }
            await input.onDone({ failed: reason === `failed` });
          },
          tools: Tools.list({ agentContext: context, input, storage }),
        }),
        locale,
      );

      stopRun.current = engine.start({ initialMessages, systemPrompt: System.prompt });
    };

    void run();

    return () => stopRun.current?.();
  },
});
