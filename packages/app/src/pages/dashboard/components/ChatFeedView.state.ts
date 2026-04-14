import type { AgentUiRequest, ChatFeedMessage } from "@snappy/agents";

import type { ChatFeedViewProps, LiveAgentSession } from "./ChatFeedView";

export type SessionCardView = {
  agentEmoji?: string;
  agentName: string;
  canStop: boolean;
  entries: SessionEntryView[];
  onRemove?: () => void;
  onStop?: () => void;
  pendingUi?: AgentUiRequest<unknown>;
  sessionId?: string;
  status: SessionStatus;
};

export type SessionEntryView =
  | { busy: boolean; html: string; id: string; regenerate: () => Promise<void>; type: `text` }
  | { busy: boolean; id: string; regenerate: () => Promise<void>; src: string; type: `image` }
  | {
      cost?: number;
      id: string;
      status: Extract<ChatFeedMessage, { type: `tool` }>[`status`];
      text: string;
      tool: Extract<ChatFeedMessage, { type: `tool` }>[`tool`];
      type: `tool`;
    };

type SessionStatus = `done` | `error` | `running` | `stopped`;

export const useChatFeedViewState = ({
  activeSession,
  onRejectUi,
  onRemoveSession,
  onResolveUi,
  onStopSession,
  pendingUi,
  regenerateArtifact,
  regeneratingMessageIds,
  sessions,
}: ChatFeedViewProps) => {
  const entryView = ({
    item,
    sessionId,
  }: {
    item: ChatFeedMessage;
    sessionId?: string;
  }): SessionEntryView | undefined => {
    if (item.type === `image`) {
      const regenerate = async () => regenerateArtifact({ kind: `image`, messageId: item.id, sessionId });

      return { busy: regeneratingMessageIds.has(item.id), id: item.id, regenerate, src: item.src, type: `image` };
    }
    if (item.type === `text`) {
      const regenerate = async () => regenerateArtifact({ kind: `text`, messageId: item.id, sessionId });

      return { busy: regeneratingMessageIds.has(item.id), html: item.html, id: item.id, regenerate, type: `text` };
    }
    if (item.type === `tool`) {
      return { cost: item.cost, id: item.id, status: item.status, text: item.text, tool: item.tool, type: `tool` };
    }

    return undefined;
  };

  const sessionCard = ({
    onRemove,
    session,
  }: {
    onRemove?: () => void;
    session: {
      agentEmoji?: string;
      agentName: string;
      entries: ChatFeedMessage[];
      sessionId?: string;
      status: SessionStatus;
    };
  }): SessionCardView => ({
    agentEmoji: session.agentEmoji,
    agentName: session.agentName,
    canStop: false,
    entries: session.entries
      .map(item => entryView({ item, sessionId: session.sessionId }))
      .filter((item): item is SessionEntryView => item !== undefined),
    onRemove,
    sessionId: session.sessionId,
    status: session.status,
  });

  const runningCard = ({ active }: { active: LiveAgentSession }): SessionCardView => ({
    agentEmoji: active.agentEmoji,
    agentName: active.agentName,
    canStop: true,
    entries: active.entries
      .map(item => entryView({ item, sessionId: undefined }))
      .filter((item): item is SessionEntryView => item !== undefined),
    onStop: onStopSession,
    pendingUi,
    sessionId: undefined,
    status: `running`,
  });

  const closedCards = sessions.map(session =>
    sessionCard({
      onRemove: () => onRemoveSession(session.id),
      session: {
        agentEmoji: session.agentEmoji,
        agentName: session.agentName,
        entries: session.entries,
        sessionId: session.id,
        status: session.status,
      },
    }),
  );

  const activeCard = activeSession === undefined ? undefined : runningCard({ active: activeSession });

  return { activeCard, onRejectUi, onResolveUi, sessionCards: closedCards };
};
