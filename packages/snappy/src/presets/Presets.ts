/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Locale } from "@snappy/intl";

import { _ } from "@snappy/core";

import type { SnappyPreset, SnappyPresetCard, SnappyPresetDraft, SnappyPresetGroupId } from "./Types";

// eslint-disable-next-line @typescript-eslint/naming-convention -- entry point glob
const modules = import.meta.glob<{ Preset: SnappyPresetDraft }>(`./items/*/Preset.ts`, { eager: true });
const groupOrder: SnappyPresetGroupId[] = [`text`, `visual`, `vision`, `edit`, `audio`, `plan`];

const list = () =>
  _.entries(modules)
    .map(([path, moduleObject]) => {
      const id = path.split(`/`).at(-2) ?? ``;

      return { draft: moduleObject.Preset, id };
    })
    .toSorted((left, right) => left.id.localeCompare(right.id));

const cards = (locale: Locale): SnappyPresetCard[] =>
  list().map(({ draft, id }) => ({
    description: draft.meta.description[locale],
    emoji: draft.meta.emoji,
    group: draft.meta.group,
    id,
    title: draft.meta.title[locale],
  }));

const byId = (presetId: string): SnappyPreset | undefined => {
  const resolvedId = presetId.trim();
  if (resolvedId === ``) {
    return undefined;
  }

  const item = list().find(entry => entry.id === resolvedId);
  if (item === undefined) {
    return undefined;
  }

  return { ...item.draft, id: resolvedId };
};

const grouped = (items: readonly SnappyPresetCard[]) => _.groupsInOrder(items, groupOrder);

export const Presets = { byId, cards, grouped };
