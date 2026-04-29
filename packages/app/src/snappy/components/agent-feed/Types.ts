import type { Ai, AiImageSize } from "@snappy/ai";
import type { StaticFormPlan } from "@snappy/snappy-sdk";
import type { Color, Typography } from "@snappy/ui";

import type { AgentArtifact } from "../Types";

export type AgentFeedArtifactSink = {
  publish: (artifact: AgentArtifact) => Promise<void> | void;
  remove?: (id: string) => Promise<void> | void;
};

export type AgentFeedEntry =
  | {
      ai?: Ai;
      artifact: AgentArtifact;
      model?: string;
      onArtifactError?: (error: unknown) => void;
      onArtifactGenerated?: (artifact: AgentArtifact) => void;
      type: `artifact`;
    }
  | { closed?: boolean; color?: Color; stream: AsyncIterable<string>; type: `stream`; typography?: Typography }
  | { finished: Promise<{ label: string }>; text: string; type: `status` }
  | { finished: Promise<{ label: string }>; text: string; type: `tool-badge` }
  | { plan: StaticFormPlan; type: `form` }
  | { text: string; type: `user` };

export type AgentFeedGenerateImageInput = { ai: Ai; model: string; prompt: string; size?: AiImageSize };

export type AgentFeedGenerateTextInput = { ai: Ai; model: string; prompt: string };

export type AgentFeedHandle = {
  appendArtifact: (artifact: AgentArtifact, options?: { ai?: Ai; model?: string }) => number;
  appendChatStream: (stream: AsyncIterable<string>) => number;
  appendForm: (plan: StaticFormPlan) => number;
  appendReasoningStream: (stream: AsyncIterable<string>) => number;
  appendStatus: (text: string, finished: Promise<{ label: string }>) => number;
  appendToolBadge: (text: string, finished: Promise<{ label: string }>) => number;
  appendUserText: (text: string) => number;
  clear: () => void;
  generateImage: (input: AgentFeedGenerateImageInput) => Promise<{ artifactId: string }>;
  generateText: (input: AgentFeedGenerateTextInput) => Promise<{ artifactId: string }>;
  removeEntry: (key: number) => void;
  updateArtifact: (id: string, patch: Partial<AgentArtifact>) => void;
};

export type AgentFeedItem = { entry: AgentFeedEntry; key: number };
