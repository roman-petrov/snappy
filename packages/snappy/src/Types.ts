import type {
  AiChatModel,
  AiImageBackground,
  AiImageModel,
  AiImageQuality,
  AiImageSize,
  AiSpeechModel,
} from "@snappy/ai";
import type { Locale } from "@snappy/intl";

import type { StaticFormAnswersOf, StaticFormPlan } from "./Schema";

export type AgentAiConfig = { models: AgentAiModels };

export type AgentAiModels = {
  chat: AiChatModel;
  image: AiImageModel;
  imageQuality: AiImageQuality;
  speech: AiSpeechModel;
  vision: AiChatModel;
};

export type AgentAsk = <TPlan extends StaticFormPlan>(plan: TPlan) => Promise<StaticFormAnswersOf<TPlan>>;

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
    edit?: AgentImageEdit;
    model: AiImageModel;
    prompt: string;
    size?: AiImageSize;
  }) => Promise<AgentFeedArtifactResult>;
  generateText: (input: { model: AiChatModel; prompt: string }) => Promise<AgentFeedArtifactResult>;
};

export type AgentImageEdit = { background?: AiImageBackground; images: File[] };

export type AgentInfo = { description: string; emoji: string; title: string };

export type AgentModuleDeps = {
  aiConfig: AgentAiConfig;
  feed: AgentFeedRuntime;
  onRunningChange?: (running: boolean) => void;
};

export type AgentModuleFactory = (deps: AgentModuleDeps) => AgentModuleHandle;

export type AgentModuleHandle = { run: () => Promise<void>; stop: () => void };
