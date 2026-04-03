import type { ImageGenerationOptions } from "@snappy/domain";
import type { ComponentType } from "react";

export type AgentCard = { description: string; emoji: string; group: AgentGroupId; id: string; title: string };

export type AgentChromeProps = {
  agentId: string;
  hostTools: AgentHostTools;
  maxPromptImageLength: number;
  maxSpeechFileMegaBytes: number;
};

export type AgentFeedItem = FeedLine & { id: string };

export type AgentGroupId = `audio` | `text` | `visual`;

export type AgentHostTools = {
  chat: (prompt: string) => Promise<string | undefined>;
  image: (prompt: string, options: ImageGenerationOptions) => Promise<Uint8Array | undefined>;
  speechRecognition: (file: File) => Promise<string | undefined>;
};

export type AgentLocale = `en` | `ru`;

export type AgentModule = {
  group: AgentGroupId;
  localize: (locale: AgentLocale) => { description: string; emoji: string; title: string };
  mount: (input: AgentMountInput) => AgentMounted;
};

export type AgentMounted = {
  title: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention -- component type
  View: ComponentType<Record<string, never>>;
};

export type AgentMountInput = {
  agentId: string;
  hostTools: AgentHostTools;
  locale: AgentLocale;
  maxPromptImageLength: number;
  maxSpeechFileMegaBytes: number;
};

export type AgentRegistryItem = { entry: AgentModule; id: string };

export type AgentSessionStep = { done: Promise<void>; id: string; label: string };

export type AgentTools = AgentHostTools & { vectorize: (input: { imageBase64: string }) => Promise<string> };

export type AgentToolStepKind = `chat` | `image` | `speechRecognition` | `vectorize`;

export type FeedLine = { imageSrc?: string; text: string };
