import { type AgentEntry, StaticFields, type StaticFormField } from "@snappy/snappy";

import type { PresetMeta } from "./Preset";
import type { StaticAgentMetaCreateInput, StaticAgentRunInput } from "./static-agent/StaticAgent";
import type {
  MetaLoc,
  StaticAudioBlock,
  StaticImageEditBlock,
  StaticLoc,
  StaticTextOrVisualBlock,
  StaticVisionBlock,
} from "./Types";

import { Prompts } from "./Prompts";
import {
  StaticAudioAgent,
  StaticImageEditAgent,
  StaticTextAgent,
  StaticVisionAgent,
  StaticVisualAgent,
} from "./static-agent";
import { StaticAgentPrompt } from "./static-agent/StaticAgentPrompt";
import { UiCommon } from "./UiCommon";

const locDeps = { prompts: Prompts, uiCommon: UiCommon };
const mediaFieldKinds = new Set<StaticFormField[`kind`]>([`audio_input`, `image_input`]);

const imageEditPrompt = <const TFields extends readonly StaticFormField[]>(input: StaticAgentRunInput<TFields>) =>
  input.plan.fields.some(field => !mediaFieldKinds.has(field.kind))
    ? StaticAgentPrompt({ answers: input.answers, mainPrompt: input.prompt, plan: input.plan })
    : undefined;

const agentParts = <TStaticLoc extends StaticLoc, const TFields extends readonly StaticFormField[]>(
  meta: PresetMeta,
  block: Pick<StaticTextOrVisualBlock<`text`, TStaticLoc, TFields>, `fields` | `localization`>,
) => {
  const localization = (): MetaLoc<TStaticLoc> => {
    const { description, title } = meta;
    const { prompt, ...ui } = block.localization(locDeps);

    return { ...ui, description, prompt, title };
  };

  const create = ({ i18n }: StaticAgentMetaCreateInput<MetaLoc<TStaticLoc>>) => ({
    description: i18n(`description`),
    emoji: meta.emoji,
    plan: { fields: block.fields({ form: StaticFields, i18n }), title: i18n(`title`) },
    prompt: i18n(`prompt`),
  });

  return { create, localization };
};

const buildTextOrVisual = <
  TKind extends `text` | `visual`,
  TStaticLoc extends StaticLoc,
  const TFields extends readonly StaticFormField[],
>(
  kind: TKind,
  meta: PresetMeta,
  block: Omit<StaticTextOrVisualBlock<TKind, TStaticLoc, TFields>, `kind`>,
): AgentEntry => {
  const { create, localization } = agentParts(meta, block);

  return kind === `text` ? StaticTextAgent(localization, create) : StaticVisualAgent(localization, create);
};

const buildTextAgent = <TStaticLoc extends StaticLoc, const TFields extends readonly StaticFormField[]>(
  meta: PresetMeta,
  block: Omit<StaticTextOrVisualBlock<`text`, TStaticLoc, TFields>, `kind`>,
): AgentEntry => buildTextOrVisual(`text`, meta, block);

const buildVisualAgent = <TStaticLoc extends StaticLoc, const TFields extends readonly StaticFormField[]>(
  meta: PresetMeta,
  block: Omit<StaticTextOrVisualBlock<`visual`, TStaticLoc, TFields>, `kind`>,
): AgentEntry => buildTextOrVisual(`visual`, meta, block);

const buildImageEditAgent = <TStaticLoc extends StaticLoc, const TFields extends readonly StaticFormField[]>(
  meta: PresetMeta,
  block: Omit<StaticImageEditBlock<TStaticLoc, TFields>, `kind`>,
): AgentEntry => {
  const { create, localization } = agentParts(meta, block);

  return StaticImageEditAgent(localization, create, block.resolve ?? (() => undefined), imageEditPrompt);
};

const buildAudioAgent = <TStaticLoc extends StaticLoc, const TFields extends readonly StaticFormField[]>(
  meta: PresetMeta,
  block: Omit<StaticAudioBlock<TStaticLoc, TFields>, `kind`>,
): AgentEntry => {
  const { create, localization } = agentParts(meta, block);

  return StaticAudioAgent(localization, create, block.resolve ?? (() => undefined));
};

const buildVisionAgent = <TStaticLoc extends StaticLoc, const TFields extends readonly StaticFormField[]>(
  meta: PresetMeta,
  block: StaticVisionBlock<TStaticLoc, TFields>,
): AgentEntry => {
  const { create, localization } = agentParts(meta, block);

  return StaticVisionAgent(localization, create, block.resolve ?? (() => undefined));
};

export const Static = { buildAudioAgent, buildImageEditAgent, buildTextAgent, buildVisionAgent, buildVisualAgent };
