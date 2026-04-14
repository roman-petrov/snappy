import type { AgentUiRequest, ChatFeedMessage } from "@snappy/agents";

import type { AgentSessionCard, RegenerateArtifactInput } from "../ChatFeed";

import { useChatFeedViewState } from "./ChatFeedView.state";
import { ChatFeedViewView } from "./ChatFeedView.view";

export type ChatFeedViewProps = {
  activeSession?: LiveAgentSession;
  onRejectUi: () => void;
  onRemoveSession: (id: string) => void;
  onResolveUi: (value: unknown) => void;
  onStopSession: () => void;
  pendingUi?: AgentUiRequest<unknown>;
  regenerateArtifact: (input: RegenerateArtifactInput) => Promise<void>;
  regeneratingMessageIds: ReadonlySet<string>;
  sessions: AgentSessionCard[];
};

export type LiveAgentSession = { agentEmoji: string; agentName: string; entries: ChatFeedMessage[]; status: `running` };

export const ChatFeedView = (props: ChatFeedViewProps) => <ChatFeedViewView {...useChatFeedViewState(props)} />;
