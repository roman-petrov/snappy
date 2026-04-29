import type { FeedArtifact } from "../../pages/feed/ChatFeed";

export type AgentArtifact =
  | (AgentArtifactSession & Extract<FeedArtifact, { type: `image` }>)
  | (AgentArtifactSession & Extract<FeedArtifact, { type: `text` }>);

export type AgentArtifactGenerationStatus = `done` | `error` | `running`;

export type AgentArtifactSession = { error?: string; generationStatus: AgentArtifactGenerationStatus; model?: string };
