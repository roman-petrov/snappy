/* eslint-disable max-depth */
/* eslint-disable init-declarations */
/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { AiChatMessage, AiChatTool } from "@snappy/ai";

import { _, StructuredPrompt } from "@snappy/core";
import { z } from "zod";

import type { AgentAdapter, AgentContext, AgentLocale, AgentStartInput, AgentStopReason } from "./Types";

export const Agent = (createAdapter: (context: AgentContext) => AgentAdapter, locale: AgentLocale) => {
  let stopped = false;
  const context: AgentContext = { isStopped: () => stopped };
  const adapter = createAdapter(context);

  const parseToolArguments = (rawArguments: string): unknown => {
    try {
      return JSON.parse(rawArguments);
    } catch {
      return undefined;
    }
  };

  const invalidToolArguments = (toolName: string, issues: z.ZodError[`issues`]): string =>
    `Invalid arguments for tool "${toolName}": ${issues
      .map(issue => {
        const path = issue.path.join(`.`);

        return path === `` ? issue.message : `${path}: ${issue.message}`;
      })
      .join(`; `)}`;

  const toolRunError = (toolName: string, error: string) => `Tool "${toolName}" failed: ${error}`;
  const separator = `:`;
  const qualify = (groupName: string, toolName: string) => `${groupName}${separator}${toolName}`;

  const parseQualifiedName = (qualifiedName: string) => {
    const parts = qualifiedName.split(separator);
    const [groupName, toolName] = parts;
    if (groupName === undefined || toolName === undefined || groupName === `` || toolName === ``) {
      return undefined;
    }

    return { groupName, toolName };
  };

  const resolveTool = (toolName: string) => {
    const parsedName = parseQualifiedName(toolName);

    return parsedName === undefined ? undefined : adapter.tools[parsedName.groupName]?.[parsedName.toolName];
  };

  return {
    context,
    start: ({ initialMessages, systemPrompt }: AgentStartInput) => {
      stopped = false;

      const run = async () => {
        let stopReason: AgentStopReason = `stopped`;
        let stopError = undefined as unknown;

        try {
          let messages: AiChatMessage[] = [
            { content: StructuredPrompt(systemPrompt), role: `system` },
            ...initialMessages,
          ];

          const tools: AiChatTool[] = _.entries(adapter.tools).flatMap(([groupName, groupTools]) =>
            _.entries(groupTools).map(([toolName, tool]) => {
              const parameters = _.fromEntries(
                _.entries(z.toJSONSchema(tool.schema, { target: `draft-7` }) as Record<string, unknown>).flatMap(
                  ([key, value]) => (key === `$schema` ? [] : [[key, value] as const]),
                ),
              );

              return { function: { description: tool.description, name: qualify(groupName, toolName), parameters } };
            }),
          );

          for (let round = 0; round < adapter.maxRounds; round += 1) {
            if (stopped) {
              break;
            }
            const message = await adapter.chat(messages, tools);
            if (message === undefined || stopped) {
              break;
            }
            await adapter.onAssistantMessage?.(message);
            messages = [...messages, message];
            await adapter.observeSessionMessages?.(messages);
            const toolCalls = message.role === `assistant` ? (message.toolCalls ?? []) : [];
            if (toolCalls.length === 0) {
              stopReason = `success`;
              break;
            }
            for (const toolCall of toolCalls) {
              if (stopped) {
                break;
              }
              const tool = resolveTool(toolCall.function.name);
              let result: string;
              if (tool === undefined) {
                result = `Unknown tool: ${toolCall.function.name}`;
              } else {
                const { data, error, success } = tool.schema.safeParse(parseToolArguments(toolCall.function.arguments));
                if (success) {
                  await adapter.onToolCallEvent?.({
                    callId: toolCall.id,
                    label: tool.formatCall(data, `running`, locale),
                    status: `running`,
                    toolName: toolCall.function.name,
                  });
                  const runResult = await tool.run(data);
                  result = _.isString(runResult) ? runResult : toolRunError(toolCall.function.name, runResult.error);
                  await adapter.onToolCallEvent?.({
                    callId: toolCall.id,
                    label: tool.formatCall(data, `completed`, locale),
                    status: `completed`,
                    toolName: toolCall.function.name,
                  });
                } else {
                  result = invalidToolArguments(toolCall.function.name, error.issues);
                }
              }
              messages = [...messages, { content: result, role: `tool`, toolCallId: toolCall.id }];
              await adapter.observeSessionMessages?.(messages);
            }
          }
        } catch (error) {
          if (stopped) {
            stopReason = `stopped`;
          } else {
            stopReason = `failed`;
            stopError = error;
          }
        }

        await adapter.onStop(stopReason, stopReason === `failed` ? stopError : undefined);
      };

      void run();

      return () => (stopped = true);
    },
  };
};
