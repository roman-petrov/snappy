// cspell:word промптом
/* eslint-disable @typescript-eslint/naming-convention */
import type { AgentEntry, StaticFormField } from "@snappy/snappy";

import { type ComponentType, createElement } from "react";

import type { PresetFlow, PresetFlowMeta, PresetFlowPageProps, PresetMeta } from "./Preset";
import type {
  SnappyBlock,
  SnappyFlowDraft,
  StaticAudioBlock,
  StaticImageEditBlock,
  StaticLoc,
  StaticPlanInput,
  StaticTextOrVisualBlock,
  StaticVisionBlock,
} from "./Types";

import { SnappyFlowPage } from "../components/SnappyFlowPage";
import { StaticFlowPage } from "../components/StaticFlowPage";
import { Static } from "./Static";

const snappyFlow = {
  id: `snappy`,
  meta: {
    description: [
      `Describe the task in your own words and refine the answer in dialogue.`,
      `Опишите задачу своими словами и уточняйте ответ в диалоге.`,
    ],
    icon: `💬`,
    title: [`Free chat`, `Свободный чат`],
  },
} as const;

const staticFlow = {
  id: `static`,
  meta: {
    description: [
      `Answer a few questions — get the finished result right away.`,
      `Ответьте на несколько вопросов — получите готовый результат сразу.`,
    ],
    icon: `📋`,
    title: [`Guided form`, `Пошаговая форма`],
  },
} as const;

type FlowOptions = { id?: string; meta?: Partial<PresetFlowMeta> };

type SnappyFlowConfig = FlowOptions & SnappyBlock;

type StaticImageEditRest<
  TStaticLoc extends StaticLoc = StaticLoc,
  TFields extends readonly StaticFormField[] = readonly StaticFormField[],
> = Omit<StaticImageEditBlock<TStaticLoc, TFields>, `fields` | `kind`>;

const localeRecord = ([en, ru]: SnappyBlock[`prompt`]) => ({ en, ru });

const snappyDraft = (meta: PresetMeta, snappy: SnappyBlock): SnappyFlowDraft => {
  const draftMeta = { description: localeRecord(meta.description), emoji: meta.emoji, title: localeRecord(meta.title) };
  const prompt = localeRecord(snappy.prompt);
  const { skill } = snappy;
  const { tools } = snappy;

  return { meta: draftMeta, prompt, skill, tools };
};

const flowMeta = (base: PresetFlowMeta, override?: Partial<PresetFlowMeta>): PresetFlowMeta => {
  const description = override?.description ?? base.description;
  const icon = override?.icon ?? base.icon;
  const title = override?.title ?? base.title;

  return { description, icon, title };
};

const snappyPage = (draft: SnappyFlowDraft): ComponentType<PresetFlowPageProps> => {
  const Page = (props: PresetFlowPageProps) => createElement(SnappyFlowPage, { ...props, draft });

  return Page;
};

const staticPage = (agent: AgentEntry, meta: PresetMeta): ComponentType<PresetFlowPageProps> => {
  const Page = (props: PresetFlowPageProps) => createElement(StaticFlowPage, { ...props, agent, meta });

  return Page;
};

const toFlowDefinition = (
  page: ComponentType<PresetFlowPageProps>,
  defaults: { id: string; meta: PresetFlowMeta },
  options?: FlowOptions,
): PresetFlow => {
  const id = options?.id ?? defaults.id;
  const meta = flowMeta(defaults.meta, options?.meta);

  return { id, meta, page };
};

const snappy = (meta: PresetMeta, config: SnappyFlowConfig): PresetFlow => {
  const { id, meta: metaOverride, ...block } = config;

  return toFlowDefinition(snappyPage(snappyDraft(meta, block)), snappyFlow, { id, meta: metaOverride });
};

const staticText = <TStaticLoc extends StaticLoc, const TFields extends readonly StaticFormField[]>(
  meta: PresetMeta,
  block: Omit<StaticTextOrVisualBlock<`text`, TStaticLoc, TFields>, `kind`>,
  options?: FlowOptions,
): PresetFlow => toFlowDefinition(staticPage(Static.buildTextAgent(meta, block), meta), staticFlow, options);

const staticVisual = <TStaticLoc extends StaticLoc, const TFields extends readonly StaticFormField[]>(
  meta: PresetMeta,
  block: Omit<StaticTextOrVisualBlock<`visual`, TStaticLoc, TFields>, `kind`>,
  options?: FlowOptions,
): PresetFlow => toFlowDefinition(staticPage(Static.buildVisualAgent(meta, block), meta), staticFlow, options);

const staticImageEdit = <TStaticLoc extends StaticLoc, const TFields extends readonly StaticFormField[]>(
  meta: PresetMeta,
  fields: (input: StaticPlanInput<TStaticLoc>) => TFields,
  block: StaticImageEditRest<TStaticLoc, TFields>,
  options?: FlowOptions,
): PresetFlow =>
  toFlowDefinition(staticPage(Static.buildImageEditAgent(meta, { ...block, fields }), meta), staticFlow, options);

const staticAudio = <TStaticLoc extends StaticLoc, const TFields extends readonly StaticFormField[]>(
  meta: PresetMeta,
  block: Omit<StaticAudioBlock<TStaticLoc, TFields>, `kind`>,
  options?: FlowOptions,
): PresetFlow => toFlowDefinition(staticPage(Static.buildAudioAgent(meta, block), meta), staticFlow, options);

const staticVision = <TStaticLoc extends StaticLoc, const TFields extends readonly StaticFormField[]>(
  meta: PresetMeta,
  block: StaticVisionBlock<TStaticLoc, TFields>,
  options?: FlowOptions,
): PresetFlow => toFlowDefinition(staticPage(Static.buildVisionAgent(meta, block), meta), staticFlow, options);

export const Flow = { snappy, staticAudio, staticImageEdit, staticText, staticVision, staticVisual };
