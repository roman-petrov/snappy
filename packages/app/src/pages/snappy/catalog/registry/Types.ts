import type { AgentDefinition, SnappyPreset, SnappyPresetCard } from "@snappy/snappy";

export type CatalogCard = SnappyPresetCard & { hasStatic: boolean };

export type CatalogEntry = { agent?: AgentDefinition; preset: SnappyPreset };
