/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-let */
/* eslint-disable init-declarations */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
import type { ZodObject } from "zod";

import { type ChatMessage, LlmErrors, type ToolCall } from "@snappy/ai";
import { Json } from "@snappy/core";
import { Presets } from "@snappy/presets";
import { zodToJsonSchema } from "zod-to-json-schema";

import type {
  AgentChatLoopInput,
  AgentMessage,
  AgentRunResult,
  AgentSessionPort,
  AgentTool,
  AgentToolDefinition,
} from "./Types";

import { ModelLog } from "./ModelLog";
import { Prompt } from "./Prompt";
import { generateImage } from "./tools";

export const Agent = ({ tools: injectedTools }: { tools: readonly AgentTool[] }) => {
  const toolResultHiddenFromFeed = (content: string): boolean => {
    if (content.trim() === ``) {
      return true;
    }
    try {
      return (Json.parse(content) as { error?: unknown }).error !== undefined;
    } catch {
      return false;
    }
  };

  const appendHttpStep = async (
    session: AgentSessionPort,
    presetId: string,
    {
      answersLocale,
      clientToolResults,
      message,
      uiAnswers,
      uiToolCallId,
    }: Pick<AgentChatLoopInput, `answersLocale` | `clientToolResults` | `message` | `uiAnswers` | `uiToolCallId`>,
  ) => {
    if (clientToolResults !== undefined) {
      for (const r of clientToolResults) {
        await session.appendMessage(`tool`, { content: r.content, tool_call_id: r.toolCallId });
      }
    }

    if (uiAnswers !== undefined) {
      const locale = answersLocale ?? `ru`;
      const labeled = presetId === `free` ? undefined : Prompt.presetPayload(presetId, locale, uiAnswers);
      const payload = labeled !== undefined && labeled.trim() !== `` ? labeled : Prompt.answersPayload(uiAnswers);
      if (presetId !== `free`) {
        await session.appendMessage(`user`, { content: payload }, { hiddenFromFeed: true });
      } else if (uiToolCallId !== undefined) {
        await session.appendMessage(`tool`, { content: payload, tool_call_id: uiToolCallId }, { hiddenFromFeed: true });
      }
    }

    if (message !== undefined && message.trim() !== ``) {
      await session.appendMessage(`user`, { content: message.trim() });
    }
  };

  const runChatLoop = async (input: AgentChatLoopInput): Promise<AgentRunResult> => {
    const {
      answersLocale,
      chatModel,
      clientToolResults,
      imageModel,
      llm,
      message,
      persistPng,
      presetId,
      session,
      uiAnswers,
      uiToolCallId,
    } = input;

    const mode = presetId === `free` ? `free` : `preset`;

    await appendHttpStep(session, presetId, { answersLocale, clientToolResults, message, uiAnswers, uiToolCallId });

    const [firstInjected] = injectedTools;

    const tools: readonly AgentTool[] =
      mode === `free`
        ? firstInjected === undefined
          ? [generateImage, ...injectedTools]
          : [firstInjected, generateImage, ...injectedTools.slice(1)]
        : [generateImage, ...injectedTools];

    const generationLocale = answersLocale ?? `ru`;
    const presetGenerationPrompt = mode === `preset` ? Presets.promptById(presetId, generationLocale) : undefined;
    const context = { generatePng: async (prompt: string) => llm.generatePng(prompt, imageModel), persistPng };

    const parametersFromSchema = (schema: ZodObject): Record<string, unknown> => {
      const raw = zodToJsonSchema(schema as never, { $refStrategy: `none` }) as Record<string, unknown>;

      return Object.fromEntries(Object.entries(raw).filter(([key]) => key !== `$schema`));
    };

    const toolDefinitions: readonly AgentToolDefinition[] = tools.map((tool): AgentToolDefinition => {
      const { run, ...decl } = tool;
      void run;

      return {
        apiDescription: decl.apiDescription,
        argsSchema: decl.argsSchema,
        definition: {
          function: {
            description: decl.apiDescription,
            name: decl.name,
            parameters: parametersFromSchema(decl.argsSchema),
          },
          type: `function`,
        },
        name: decl.name,
        systemPrompt: decl.systemPrompt,
      };
    });

    const intro = Prompt.intro({ mode, presetGenerationPrompt });
    const outro = Prompt.outro(mode);
    const agentToolsList = toolDefinitions.map(tool => tool.definition);

    const agentSystemBase = Prompt.systemBase(
      intro,
      toolDefinitions.map(tool => tool.systemPrompt),
      outro,
    );

    const maxToolIterations = 8;

    const rowToChat = (row: { content: unknown; role: string }): ChatMessage => {
      const c = row.content as Record<string, unknown>;
      if (row.role === `tool`) {
        return { content: String(c[`content`] ?? ``), role: `tool`, tool_call_id: String(c[`tool_call_id`] ?? ``) };
      }
      if (row.role === `assistant`) {
        const toolCalls = c[`tool_calls`] as ToolCall[] | undefined;

        return {
          content:
            c[`content`] === null || c[`content`] === undefined
              ? undefined
              : typeof c[`content`] === `string`
                ? c[`content`]
                : String(c[`content`]),
          role: `assistant`,
          ...(toolCalls === undefined ? {} : { tool_calls: toolCalls }),
        };
      }

      return { content: String(c[`content`] ?? ``), role: `user` };
    };

    const parseToolArgs = (raw: string): unknown => {
      try {
        return Json.parse(raw);
      } catch {
        return {};
      }
    };

    const toApiMessages = (rows: AgentMessage[]): AgentMessage[] => rows.map(r => ({ ...r }));
    const rows = await session.messages();
    const history = rows.map(rowToChat);
    const messages: ChatMessage[] = [{ content: agentSystemBase, role: `system` }, ...history];

    for (let index = 0; index < maxToolIterations; index++) {
      const requestPayload = { messages, model: chatModel, tools: agentToolsList };
      let completion: Awaited<ReturnType<typeof llm.chatCompletion>>;
      try {
        completion = await llm.chatCompletion(requestPayload);
      } catch (error: unknown) {
        await ModelLog.failedRequest(index, requestPayload);
        if (error instanceof Error && error.message === LlmErrors.bridgeOffline) {
          return { status: `relayOffline` };
        }

        return { status: `processingFailed` };
      }

      await ModelLog.round(index, requestPayload, completion);

      const [choice] = completion.choices;
      if (choice === undefined) {
        return { status: `processingFailed` };
      }

      const assistantMessage = choice.message;
      if (assistantMessage.tool_calls !== undefined && assistantMessage.tool_calls.length > 0) {
        await session.appendMessage(`assistant`, {
          content: assistantMessage.content ?? undefined,
          tool_calls: assistantMessage.tool_calls,
        });

        const updatedRows = await session.messages();

        for (const tc of assistantMessage.tool_calls) {
          const tool = tools.find(t => t.name === tc.function.name);
          const run = tool?.run;
          const args = parseToolArgs(tc.function.arguments);

          if (run === undefined) {
            await session.appendMessage(
              `tool`,
              { content: Json.stringify({ error: `unknown_tool` }), tool_call_id: tc.id },
              { hiddenFromFeed: true },
            );
            continue;
          }

          const result = await run(context, { args, toolCallId: tc.id });

          if (result.kind === `tool_message`) {
            await session.appendMessage(
              `tool`,
              { content: result.content, tool_call_id: tc.id },
              { hiddenFromFeed: toolResultHiddenFromFeed(result.content) },
            );
          } else if (result.kind === `pending_ui`) {
            await session.touch();

            return {
              messages: toApiMessages(updatedRows),
              pendingUi: { plan: result.plan, toolCallId: result.toolCallId },
              status: `ok`,
            };
          } else {
            await session.touch();

            return {
              messages: toApiMessages(updatedRows),
              pendingClientTool: { args: result.args, toolCallId: result.toolCallId },
              status: `ok`,
            };
          }
        }

        const afterTool = await session.messages();
        messages.length = 0;
        messages.push({ content: agentSystemBase, role: `system` }, ...afterTool.map(rowToChat));
        continue;
      }

      const assistantText = assistantMessage.content ?? ``;
      await session.appendMessage(`assistant`, { content: assistantText });
      await session.touch();
      const finalRows = await session.messages();

      return { messages: toApiMessages(finalRows), status: `ok` };
    }

    return { status: `processingFailed` };
  };

  return { runChatLoop };
};

export type Agent = ReturnType<typeof Agent>;
