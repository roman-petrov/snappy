import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

import type { AgentGroupId } from "./AgentGroupId";
import type { Bilingual } from "./Bilingual";

export type Preset = { flows: readonly PresetFlow[]; meta: PresetMeta };

export type PresetFlow = { id: string; meta: PresetFlowMeta; page: ComponentType<PresetFlowPageProps> };

export type PresetFlowIcon = LucideIcon | string;

export type PresetFlowMeta = { description: Bilingual; icon: PresetFlowIcon; title: Bilingual };

export type PresetFlowPageProps = { presetId?: string };

export type PresetMeta = { description: Bilingual; emoji: string; group: AgentGroupId; title: Bilingual };
