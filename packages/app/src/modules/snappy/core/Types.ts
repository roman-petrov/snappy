import type { Bilingual, Locale } from "@snappy/intl";
import type { AgentImageEdit, SkillId, SnappyToolId, StaticFields, StaticFormField } from "@snappy/snappy";

import type { PresetMeta } from "./Preset";
import type { Prompts } from "./Prompts";
import type { StaticAgentRunInput } from "./static-agent/StaticAgent";
import type { UiCommon } from "./UiCommon";

export type MetaLoc<TStaticLoc extends StaticLoc> = Omit<TStaticLoc, `prompt`> &
  Pick<PresetMeta, `description` | `title`> &
  Pick<StaticLoc, `prompt`>;

export type SnappyBlock = { prompt: Bilingual; skill?: SkillId; tools: readonly SnappyToolId[] };

export type SnappyFlowDraft = {
  meta: { description: Record<Locale, string>; emoji: string; title: Record<Locale, string> };
  prompt: Record<Locale, string>;
  skill?: SkillId;
  tools: readonly SnappyToolId[];
};

export type StaticAudioBlock<
  TStaticLoc extends StaticLoc = StaticLoc,
  TFields extends readonly StaticFormField[] = readonly StaticFormField[],
> = {
  fields: (input: StaticPlanInput<TStaticLoc>) => TFields;
  kind: `audio`;
  localization: (deps: StaticLocalizationDeps) => TStaticLoc;
  resolve?: (input: StaticAgentRunInput<NoInfer<TFields>>) => File | undefined;
};

export type StaticImageEditBlock<
  TStaticLoc extends StaticLoc = StaticLoc,
  TFields extends readonly StaticFormField[] = readonly StaticFormField[],
> = {
  fields: (input: StaticPlanInput<TStaticLoc>) => TFields;
  kind: `imageEdit`;
  localization: (deps: StaticLocalizationDeps) => TStaticLoc;
  resolve?: (input: StaticAgentRunInput<NoInfer<TFields>>) => AgentImageEdit | undefined;
};

export type StaticLoc = Record<string, Bilingual> & { prompt: Bilingual };

export type StaticPlanInput<TStaticLoc extends StaticLoc> = {
  form: typeof StaticFields;
  i18n: (key: keyof MetaLoc<TStaticLoc> & string) => string;
};

export type StaticTextOrVisualBlock<
  TKind extends `text` | `visual`,
  TStaticLoc extends StaticLoc = StaticLoc,
  TFields extends readonly StaticFormField[] = readonly StaticFormField[],
> = {
  fields: (input: StaticPlanInput<TStaticLoc>) => TFields;
  kind: TKind;
  localization: (deps: StaticLocalizationDeps) => TStaticLoc;
};

export type StaticVisionBlock<
  TStaticLoc extends StaticLoc = StaticLoc,
  TFields extends readonly StaticFormField[] = readonly StaticFormField[],
> = {
  fields: (input: StaticPlanInput<TStaticLoc>) => TFields;
  localization: (deps: StaticLocalizationDeps) => TStaticLoc;
  resolve?: (input: StaticAgentRunInput<NoInfer<TFields>>) => File | undefined;
};

type StaticLocalizationDeps = { prompts: typeof Prompts; uiCommon: typeof UiCommon };
