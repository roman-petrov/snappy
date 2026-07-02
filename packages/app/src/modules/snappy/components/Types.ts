import type { AiImageSize } from "@snappy/ai";
import type { AgentImageEdit } from "@snappy/snappy";

export type AgentArtifact =
  | (AgentArtifactSession & { generationPrompt: string; id?: string; src: string; type: `image` })
  | (AgentArtifactSession & { generationPrompt: string; id?: string; text: string; type: `text` });

export type AgentArtifactGenerationStatus = `done` | `error` | `running`;

export type AgentArtifactSession = {
  edit?: AgentImageEdit;
  error?: string;
  generationStatus: AgentArtifactGenerationStatus;
  model?: string;
  size?: AiImageSize;
};
