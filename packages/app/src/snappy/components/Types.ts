import type { AiImageSize } from "@snappy/ai";
import type { TrpcOutputs } from "@snappy/app-server-api";
import type { AgentImageEdit } from "@snappy/snappy-sdk";

export type AgentArtifact =
  | (AgentArtifactSession & Extract<FeedArtifact, { type: `image` }>)
  | (AgentArtifactSession & Extract<FeedArtifact, { type: `text` }>)
  | (AgentArtifactSession & { generationPrompt: string; src: string; type: `image` })
  | (AgentArtifactSession & { generationPrompt: string; text: string; type: `text` });

export type AgentArtifactGenerationStatus = `done` | `error` | `running`;

export type AgentArtifactSession = {
  edit?: AgentImageEdit;
  error?: string;
  generationStatus: AgentArtifactGenerationStatus;
  model?: string;
  size?: AiImageSize;
};

export type FeedArtifact = TrpcOutputs[`feed`][`list`][`items`][number];
