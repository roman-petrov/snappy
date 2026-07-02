import type { Bilingual } from "@snappy/intl";
import type { ComponentType } from "react";

import type { AgentGroupId } from "./AgentGroupId";

export type Preset = { flows: readonly PresetFlow[]; meta: PresetMeta };

export type PresetFlow = { id: string; meta: PresetFlowMeta; page: ComponentType<PresetFlowPageProps> };

export type PresetFlowMeta = { description: Bilingual; icon: string; title: Bilingual };

export type PresetFlowPageProps = { presetId?: string };

export type PresetMeta = { description: Bilingual; emoji: string; group: AgentGroupId; title: Bilingual };
