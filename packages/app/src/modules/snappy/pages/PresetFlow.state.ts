import { Language } from "@snappy/ui";
import { useMemo } from "react";

import type { PresetFlowProps } from "./PresetFlow";

import { Catalog } from "../catalog";

export const usePresetFlowState = ({ flowId, presetId }: PresetFlowProps) => {
  const locale = Language.locale();
  const entry = useMemo(() => Catalog.byId(presetId, locale), [locale, presetId]);
  const flow = useMemo(() => entry?.flows.find(item => item.id === flowId), [entry, flowId]);
  const invalid = entry === undefined || flow === undefined;

  return { flow, invalid, presetId };
};
