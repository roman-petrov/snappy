/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Locale } from "@snappy/intl";
import type { AgentDefinition, AgentEntry, SnappyPreset, SnappyPresetDraft, SnappyPresetGroupId } from "@snappy/snappy";

import { _ } from "@snappy/core";

import type { CatalogCard, CatalogEntry } from "./Types";

// eslint-disable-next-line @typescript-eslint/naming-convention -- entry point glob
const presetModules = import.meta.glob<{ Preset: SnappyPresetDraft }>(`../items/*/Preset.ts`, { eager: true });
// eslint-disable-next-line @typescript-eslint/naming-convention -- entry point glob
const agentModules = import.meta.glob<{ Agent: AgentEntry }>(`../items/*/Agent.ts`, { eager: true });
const groupOrder: SnappyPresetGroupId[] = [`text`, `visual`, `vision`, `edit`, `audio`, `plan`];
const idFromPath = (path: string) => path.split(`/`).at(-2) ?? ``;

const presets = () =>
  _.entries(presetModules)
    .map(([path, moduleObject]) => ({ draft: moduleObject.Preset, id: idFromPath(path) }))
    .toSorted((left, right) => left.id.localeCompare(right.id));

const agents = (locale: Locale) =>
  _.entries(agentModules)
    .map(([path, moduleObject]) => ({ entry: moduleObject.Agent(locale), id: idFromPath(path) }))
    .toSorted((left, right) => left.id.localeCompare(right.id));

const cards = (locale: Locale): CatalogCard[] =>
  presets().map(({ draft, id }) => ({
    description: draft.meta.description[locale],
    emoji: draft.meta.emoji,
    group: draft.meta.group,
    hasStatic: agentModules[`../items/${id}/Agent.ts`] !== undefined,
    id,
    title: draft.meta.title[locale],
  }));

const byId = (presetId: string, locale: Locale): CatalogEntry | undefined => {
  const resolvedId = presetId.trim();
  if (resolvedId === ``) {
    return undefined;
  }

  const item = presets().find(entry => entry.id === resolvedId);
  if (item === undefined) {
    return undefined;
  }

  const preset: SnappyPreset = { ...item.draft, id: resolvedId };
  const agentEntry = agents(locale).find(entry => entry.id === resolvedId)?.entry;
  const agent: AgentDefinition | undefined = agentEntry === undefined ? undefined : { ...agentEntry, id: resolvedId };

  return { agent, preset };
};

const grouped = (items: readonly CatalogCard[]) => _.groupsInOrder(items, groupOrder);

export const Catalog = { byId, cards, grouped };
