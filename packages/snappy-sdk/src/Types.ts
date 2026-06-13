import type { Ai, AiConnectionOptions, AiImageBackground, AiImageQuality, AiImageSize } from "@snappy/ai";
import type { Locale } from "@snappy/intl";

import type { StaticFormAnswersOf, StaticFormPlan } from "./Schema";

export type AgentAiConfig = { models: AgentAiModels; options: AgentAiOptions };

export type AgentAiModels = { chat: string; image: string; imageQuality: AiImageQuality; look: string; speech: string };

export type AgentAiOptions = AiConnectionOptions;

export type AgentAsk = <TPlan extends StaticFormPlan>(plan: TPlan) => Promise<StaticFormAnswersOf<TPlan>>;

export type AgentCard = AgentInfo & { id: string };

export type AgentDefinition = ReturnType<AgentEntry> & { id: string };

export type AgentEntry = (locale: Locale) => { meta: AgentInfo; module: AgentModuleFactory };

export type AgentFeedArtifactResult = { artifactId: string; content: string };

export type AgentFeedRuntime = {
  appendChatStream: (stream: AsyncIterable<string>) => Promise<void>;
  appendChatText: (text: string) => Promise<void>;
  appendReasoningStream: (stream: AsyncIterable<string>) => Promise<void>;
  appendStatus: (text: string, done: PromiseWithResolvers<{ label: string }>) => number;
  appendToolBadge: (text: string, done: PromiseWithResolvers<{ label: string }>) => number;
  appendUserText: (text: string) => number;
  ask: AgentAsk;
  generateImage: (input: {
    ai: Ai;
    edit?: AgentImageEdit;
    model: string;
    prompt: string;
    size?: AiImageSize;
  }) => Promise<AgentFeedArtifactResult>;
  generateText: (input: { ai: Ai; model: string; prompt: string }) => Promise<AgentFeedArtifactResult>;
};

export type AgentGroupId = `audio` | `lab` | `text` | `visual`;

export type AgentImageEdit = { background?: AiImageBackground; images: File[] };

export type AgentInfo = { description: string; emoji: string; group: AgentGroupId; title: string };

export type AgentModuleDeps = {
  aiConfig: AgentAiConfig;
  feed: AgentFeedRuntime;
  onRunningChange?: (running: boolean) => void;
};

export type AgentModuleFactory = (deps: AgentModuleDeps) => AgentModuleHandle;

export type AgentModuleHandle = { run: () => Promise<void>; stop: () => void };
