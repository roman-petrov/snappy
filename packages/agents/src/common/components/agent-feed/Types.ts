import type { AgentArtifact } from "../../../Types";

export type AgentFeedEntry =
  | { artifact: AgentArtifact; type: `artifact` }
  | { chunks: AsyncIterable<string>; generationPrompt: string; type: `text-card-stream` }
  | { chunks: AsyncIterable<string>; tool: `chat`; type: `stream` }
  | { finished: Promise<{ label: string }>; text: string; type: `status` }
  | { generationPrompt: string; type: `image-card-progress` };

export type AgentFeedItem = { entry: AgentFeedEntry; key: number };
