import type { UiPlan } from "@snappy/domain";

import type { PresetGroupId, PresetSourceInput } from "./PresetSchema";

export type { PresetGroupId, PresetLabels, PresetLocale, PresetSourceInput } from "./PresetSchema";

export type ApiPreset = {
  description: string;
  emoji: string;
  group: PresetGroupId;
  id: string;
  prompt: string;
  title: string;
  uiPlan?: UiPlan;
};

export type PresetSource = PresetSourceInput & { id: string };
