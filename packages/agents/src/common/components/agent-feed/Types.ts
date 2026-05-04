import type { AgentArtifact } from "../../../Types";

export type AgentFeedEntry =
  | { artifact: AgentArtifact; type: `artifact` }
  | { chunks: AsyncIterable<string>; tool: `chat`; type: `stream` }
  | { finished: Promise<{ label: string }>; text: string; type: `status` };

export type AgentFeedItem = { entry: AgentFeedEntry; key: number };
