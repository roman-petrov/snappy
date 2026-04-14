import type { AgentGroupId } from "../Types";

export type AgentMetaPayload = { en: MetaLocalePack; group: AgentGroupId; ru: MetaLocalePack };

export type Meta = (parameters: MetaParameters) => AgentMetaPayload;

export type MetaLocalePack = {
  description: string;
  emoji: string;
  prompt: string;
  title: string;
  uiPlan: StaticFormPlan;
};

export type MetaParameters = { maxImagePromptLength?: number; maxSpeechFileMegaBytes?: number };

export type StaticFormAnswers = Record<string, boolean | File | number | string | string[] | undefined>;

export type StaticFormField =
  | { accept?: string; hint?: string; id: string; kind: `file`; label: string; pickLabel: string }
  | { default?: boolean; id: string; kind: `toggle`; label: string; promptOff?: string; promptOn?: string }
  | { default?: string; id: string; kind: `tabs_single`; label: string; options: StaticTabOption[] }
  | {
      default?: string;
      id: string;
      kind: `text`;
      label: string;
      omitWhenEmpty?: boolean;
      placeholder?: string;
      prompt?: string;
    }
  | { default?: string[]; id: string; kind: `tabs_multi`; label: string; options: StaticTabOption[] };

export type StaticFormPlan = { fields: readonly StaticFormField[] };

export type StaticTabOption = { label: string; prompt?: string; value: string };
