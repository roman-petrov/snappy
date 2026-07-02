import { _ } from "@snappy/core";
import { Bilingual, type Locale } from "@snappy/intl";

import type { Preset, PresetFlowMeta, PresetMeta } from "../core/Preset";
import type { CatalogCard, CatalogEntry, CatalogFlow } from "./CatalogTypes";

import { AgentGroupId } from "../core/AgentGroupId";

const presetModules = import.meta.glob<{ preset: Preset }>(`../presets/*/Preset.ts`, { eager: true });
const presetIdIndex = -2;
const idFromPath = (path: string) => path.split(`/`).at(presetIdIndex) ?? ``;

const entries = () =>
  _.entries(presetModules)
    .map(([path, moduleObject]) => ({ id: idFromPath(path), item: moduleObject.preset }))
    .toSorted((left, right) => left.id.localeCompare(right.id));

const at = (meta: PresetMeta, locale: Locale) => ({
  description: Bilingual.pick(locale, meta.description),
  emoji: meta.emoji,
  group: meta.group,
  title: Bilingual.pick(locale, meta.title),
});

const flowAt = (meta: PresetFlowMeta, locale: Locale) => ({
  description: Bilingual.pick(locale, meta.description),
  icon: meta.icon,
  title: Bilingual.pick(locale, meta.title),
});

const flow = (definition: Preset[`flows`][number], locale: Locale): CatalogFlow => ({
  ...flowAt(definition.meta, locale),
  id: definition.id,
  page: definition.page,
});

const cards = (locale: Locale): CatalogCard[] => entries().map(({ id, item }) => ({ ...at(item.meta, locale), id }));

const byId = (presetId: string, locale: Locale): CatalogEntry | undefined => {
  const item = entries().find(entry => entry.id === presetId.trim());

  if (item === undefined) {
    return undefined;
  }

  const { emoji, title } = at(item.item.meta, locale);

  return { flows: item.item.flows.map(definition => flow(definition, locale)), meta: { emoji, title } };
};

const grouped = (items: readonly CatalogCard[]) => _.groupsInOrder(items, AgentGroupId);

export const Catalog = { byId, cards, grouped };
