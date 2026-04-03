import { type PresetLocale, Presets as PresetsCore } from "@snappy/presets";

export const Presets = () => ({
  byId: (id: string, locale: string) => {
    const loc: PresetLocale = locale === `en` ? `en` : `ru`;
    const preset = PresetsCore.presetById(id, loc);

    return preset === undefined ? { status: `presetNotFound` as const } : { preset };
  },
  list: (locale: string) => {
    const loc: PresetLocale = locale === `en` ? `en` : `ru`;

    return { groupOrder: PresetsCore.groupOrder, presets: PresetsCore.localized(loc) };
  },
});

export type Presets = ReturnType<typeof Presets>;
