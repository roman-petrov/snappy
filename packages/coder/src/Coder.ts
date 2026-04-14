import type { AiChatMessage, AiChatTool, AiModel } from "@snappy/ai";

import { Agent, type AgentAdapter } from "@snappy/agent";

import { System } from "./System";

export type CoderAgent = Omit<ReturnType<typeof Agent>, `start`> & {
  start: (messages: AiChatMessage[]) => ReturnType<ReturnType<typeof Agent>[`start`]>;
};

export type CoderConfig = Pick<
  AgentAdapter,
  `observeSessionMessages` | `onAssistantMessage` | `onStop` | `onToolCallEvent` | `tools`
> & { chatModel: Extract<AiModel, { type: `chat` }>; locale: string };

export const Coder = ({ chatModel, locale, tools, ...rest }: CoderConfig): CoderAgent => {
  const agent = Agent(
    () => ({
      chat: async (messages: AiChatMessage[], chatTools: AiChatTool[]): Promise<AiChatMessage | undefined> =>
        (await (await chatModel.process({ messages, toolChoice: `auto`, tools: chatTools })).done).message,
      maxRounds: 24,
      ...rest,
      tools,
    }),
    locale,
  );

  return {
    context: agent.context,
    start: messages => agent.start({ initialMessages: messages, systemPrompt: System.prompt }),
  };
};
