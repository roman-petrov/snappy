/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { type AgentEntry, StaticFields, type StaticFormField } from "@snappy/snappy";

import type { PresetMeta } from "./Preset";
import type { StaticAgentMetaCreateInput, StaticAgentRunInput } from "./static-agent/StaticAgent";
import type {
  MetaLoc,
  StaticAudioBlock,
  StaticImageEditBlock,
  StaticImageFormat,
  StaticLoc,
  StaticTextOrVisualBlock,
  StaticVisionBlock,
} from "./Types";

import { ImageFormat } from "./ImageFormat";
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
const mediaFieldKinds = new Set<StaticFormField[`kind`]>([`audio_input`, `image_input`]);const formatEnabled = (format?: StaticImageFormat) => format !== undefined && format !== false;

const imageEditPrompt = <const TFields extends readonly StaticFormField[]>(input: StaticAgentRunInput<TFields>) =>
  input.plan.fields.some(field => !mediaFieldKinds.has(field.kind))
    ? StaticAgentPrompt({ answers: input.answers, locale: input.locale, mainPrompt: input.prompt, plan: input.plan })
    : undefined;

const agentParts = <TStaticLoc extends StaticLoc, const TFields extends readonly StaticFormField[]>(
  meta: PresetMeta,
  block: Pick<StaticTextOrVisualBlock<`text`, TStaticLoc, TFields>, `fields` | `localization`>,
  format?: StaticImageFormat,
) => {
  const localization = (): MetaLoc<TStaticLoc> => {
    const { description, title } = meta;
    const { prompt, ...ui } = block.localization(locDeps);

    return { ...ui, description, prompt, title };
  };

  const create = ({ i18n, locale }: StaticAgentMetaCreateInput<MetaLoc<TStaticLoc>>) => {
    const base = block.fields({ form: StaticFields, i18n });

    const fields = formatEnabled(format)
      ? ([...base, ImageFormat.field(locale, format === true ? undefined : format)] as unknown as TFields)
      : base;

    return { description: i18n(`description`), emoji: meta.emoji, plan: { fields, title: i18n(`title`) }, prompt: i18n(`prompt`) };
  };

  return { create, localization };
};

const buildTextAgent = <TStaticLoc extends StaticLoc, const TFields extends readonly StaticFormField[]>(
  meta: PresetMeta,
  block: Omit<StaticTextOrVisualBlock<`text`, TStaticLoc, TFields>, `kind`>,
): AgentEntry => {
  const { create, localization } = agentParts(meta, block);

  return StaticTextAgent(localization, create);
};

const buildVisualAgent = <TStaticLoc extends StaticLoc, const TFields extends readonly StaticFormField[]>(
  meta: PresetMeta,
  block: Omit<StaticTextOrVisualBlock<`visual`, TStaticLoc, TFields>, `kind`>,
): AgentEntry => {
  const { create, localization } = agentParts(meta, block, block.format);

  return StaticVisualAgent(localization, create, formatEnabled(block.format) ? ImageFormat.size : undefined);
};

const buildImageEditAgent = <TStaticLoc extends StaticLoc, const TFields extends readonly StaticFormField[]>(
  meta: PresetMeta,
  block: Omit<StaticImageEditBlock<TStaticLoc, TFields>, `kind`>,
): AgentEntry => {
  const { create, localization } = agentParts(meta, block, block.format);

  return StaticImageEditAgent(
    localization,
    create,
    block.resolve ?? (() => undefined),
    imageEditPrompt,
    formatEnabled(block.format) ? ImageFormat.size : undefined,
  );
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
