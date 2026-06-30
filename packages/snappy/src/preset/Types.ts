import type { Locale } from "@snappy/intl";

import type tools from "../tools/index";

export type SnappyPreset = SnappyPresetDraft & { id: string };

export type SnappyPresetCard = {
  description: string;
  emoji: string;
  group: SnappyPresetGroupId;
  id: string;
  title: string;
};

export type SnappyPresetDraft = {
  meta: SnappyPresetMeta;
  prompt: Record<Locale, string>;
  skill?: string;
  tools: readonly SnappyToolId[];
};

export type SnappyPresetGroupId = `audio` | `edit` | `plan` | `text` | `vision` | `visual`;

export type SnappyPresetMeta = {
  description: Record<Locale, string>;
  emoji: string;
  group: SnappyPresetGroupId;
  title: Record<Locale, string>;
};

export type SnappyToolId = keyof typeof tools;
