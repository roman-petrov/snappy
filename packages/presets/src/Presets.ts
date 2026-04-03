import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import type { ApiPreset, PresetGroupId, PresetLocale, PresetSource } from "./Types";

import { PresetSchema } from "./PresetSchema";

const idFromJsonFile = (file: string): string => file.replace(/\.json$/u, ``);
const presetsDir = join(import.meta.dirname, `presets`);

const loadSources = async (): Promise<readonly PresetSource[]> => {
  const files = (await readdir(presetsDir)).filter(name => name.endsWith(`.json`));

  const loaded = await Promise.all(
    files.map(async file => {
      const text = await readFile(join(presetsDir, file), `utf8`);
      const parsed: unknown = JSON.parse(text);
      const body = PresetSchema.sourceInput.parse(parsed);

      return { ...body, id: idFromJsonFile(file) };
    }),
  );

  return loaded.toSorted((left, right) => left.id.localeCompare(right.id));
};

const presetSources: readonly PresetSource[] = await loadSources();
const list = (): readonly PresetSource[] => presetSources;
const groupOrder: readonly PresetGroupId[] = [`text`, `greetings`, `business`, `plans`, `visual`, `data`];

const localize = (source: PresetSource, locale: PresetLocale): ApiPreset => {
  const block = source[locale];

  return {
    description: block.labels.description,
    emoji: block.emoji,
    group: source.group,
    id: source.id,
    prompt: block.prompt,
    title: block.labels.title,
    uiPlan: block.uiPlan,
  };
};

const presetsByGroup = (items: readonly ApiPreset[]): Map<PresetGroupId, ApiPreset[]> => {
  const grouped = items.reduce<Partial<Record<PresetGroupId, ApiPreset[]>>>((accumulator, preset) => {
    const bucket = accumulator[preset.group] ?? [];

    return { ...accumulator, [preset.group]: [...bucket, preset] };
  }, {});

  return new Map(
    groupOrder.flatMap(groupId => {
      const groupPresets = grouped[groupId];

      return groupPresets === undefined || groupPresets.length === 0 ? [] : [[groupId, groupPresets]];
    }),
  );
};

const localized = (locale: PresetLocale): ApiPreset[] => list().map(s => localize(s, locale));

const presetById = (id: string, locale: PresetLocale): ApiPreset | undefined => {
  const source = list().find(s => s.id === id);

  return source === undefined ? undefined : localize(source, locale);
};

const promptById = (id: string, locale: PresetLocale): string => list().find(s => s.id === id)?.[locale].prompt ?? ``;

export const Presets = { groupOrder, list, localized, presetById, presetsByGroup, promptById };
