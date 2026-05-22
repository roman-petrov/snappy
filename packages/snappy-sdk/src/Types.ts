import type { Ai, AiConnectionOptions, AiImageQuality, AiImageSize } from "@snappy/ai";
import type { Locale } from "@snappy/intl";

import type { StaticFormAnswersOf, StaticFormPlan } from "./Schema";

export type AgentAiConfig = { models: AgentAiModels; options: AgentAiOptions };

export type AgentAiModels = { chat: string; image: string; imageQuality: AiImageQuality; speech: string };

export type AgentAiOptions = AiConnectionOptions;

export type AgentAsk = <TPlan extends StaticFormPlan>(plan: TPlan) => Promise<StaticFormAnswersOf<TPlan>>;

export type AgentCard = AgentInfo & { id: string };

export type AgentDefinition = ReturnType<AgentEntry> & { id: string };

export type AgentEntry = (locale: Locale) => { meta: AgentInfo; module: AgentModuleFactory };

export type AgentFeedRuntime = {
  appendChatStream: (stream: AsyncIterable<string>) => number;
  appendReasoningStream: (stream: AsyncIterable<string>) => number;
  appendStatus: (text: string, finished: Promise<{ label: string }>) => number;
  appendToolBadge: (text: string, finished: Promise<{ label: string }>) => number;
  appendUserText: (text: string) => number;
  ask: AgentAsk;
  generateImage: (input: {
    ai: Ai;
    model: string;
    prompt: string;
    size?: AiImageSize;
  }) => Promise<{ artifactId: string }>;
  generateText: (input: { ai: Ai; model: string; prompt: string }) => Promise<{ artifactId: string }>;
};

export type AgentGroupId = `audio` | `lab` | `text` | `visual`;

export type AgentInfo = { description: string; emoji: string; group: AgentGroupId; title: string };

export type AgentModuleDeps = {
  aiConfig: AgentAiConfig;
  feed: AgentFeedRuntime;
  onRunningChange?: (running: boolean) => void;
};

export type AgentModuleFactory = (deps: AgentModuleDeps) => AgentModuleHandle;

export type AgentModuleHandle = { run: () => Promise<void>; stop: () => void };
