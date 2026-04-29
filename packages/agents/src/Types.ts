import type { AiConnectionOptions, AiImageQuality } from "@snappy/ai";
import type { FunctionComponent } from "react";

export type AgentAiConfig = { models: AgentAiModels; options: AgentAiOptions };

export type AgentAiModels = { chat: string; image: string; imageQuality: AiImageQuality; speech: string };

export type AgentAiOptions = AiConnectionOptions;

export type AgentArtifact =
  | { agentId: string; generationPrompt: string; html: string; id: string; type: `text` }
  | { agentId: string; generationPrompt: string; id: string; src: string; type: `image` };

export type AgentCard = AgentInfo & { id: string };

export type AgentComponentProps = {
  aiConfig: AgentAiConfig;
  locale: AgentLocale;
  onArtifacts: (items: AgentArtifact[]) => Promise<void>;
  onRequestClose: () => void;
  onRunningChange: (running: boolean) => void;
};

export type AgentDefinition = {
  component: FunctionComponent<AgentComponentProps>;
  headless: AgentHeadlessApi;
  id: string;
  meta: AgentInfo;
};

export type AgentGroupId = `audio` | `lab` | `text` | `visual`;

export type AgentHeadlessApi = { regenerate: (input: AgentRegenerateInput) => Promise<AgentRegeneratePatch> };

export type AgentInfo = { description: string; emoji: string; group: AgentGroupId; title: string };

export type AgentLocale = `en` | `ru`;

export type AgentRegenerateInput = { aiConfig: AgentAiConfig; artifact: AgentArtifact; locale: AgentLocale };

export type AgentRegeneratePatch = { html?: string; src?: string };
