import type { AgentAiConfig } from "@snappy/snappy";

import type { AgentFeedHandle } from "./AgentFeedHandle";

import { useAgentChatState } from "./AgentChat.state";
import { AgentChatView } from "./AgentChat.view";

export type AgentChatProps = {
  runtime: (context: AgentChatRuntimeContext) => AgentChatRuntime;
  session?: readonly (string | undefined)[];
  showFeed?: boolean;
};

export type AgentChatRuntime = { run: () => Promise<void> | void; stop: () => void };

export type AgentChatRuntimeContext = { aiConfig: AgentAiConfig; feed: AgentFeedHandle };

export const AgentChat = (props: AgentChatProps) => <AgentChatView {...useAgentChatState(props)} />;
