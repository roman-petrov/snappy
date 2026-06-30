import { Language } from "@snappy/ui";
import { useMemo } from "react";

import type { PresetHubProps } from "./PresetHub";

import { Catalog } from "../catalog";

export const usePresetHubState = ({ presetId }: PresetHubProps) => {
  const locale = Language.locale();
  const entry = useMemo(() => Catalog.byId(presetId, locale), [locale, presetId]);

  return { entry, invalid: entry === undefined, presetId };
};
