import { Language } from "@snappy/ui";
import { useMemo } from "react";

import type { PresetPickerProps } from "./PresetPicker";

import { Catalog } from "../catalog/registry";

export const usePresetPickerState = ({ presetId }: PresetPickerProps) => {
  const locale = Language.locale();
  const entry = useMemo(() => Catalog.byId(presetId, locale), [locale, presetId]);
  const card = useMemo(() => Catalog.cards(locale).find(item => item.id === presetId), [locale, presetId]);
  const invalid = entry === undefined || card === undefined;
  const missingStatic = !invalid && !card.hasStatic;
  const pageTitle = card === undefined ? undefined : `${card.emoji} ${card.title}`;

  return { card, entry, invalid, missingStatic, pageTitle };
};
