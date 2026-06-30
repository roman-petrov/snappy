import type { ComponentType } from "react";

import type { AgentGroupId } from "../core/AgentGroupId";
import type { PresetFlowPageProps } from "../core/Preset";

export type CatalogCard = { description: string; emoji: string; group: AgentGroupId; id: string; title: string };

export type CatalogEntry = { flows: CatalogFlow[]; meta: { emoji: string; title: string } };

export type CatalogFlow = {
  description: string;
  icon: string;
  id: string;
  page: ComponentType<PresetFlowPageProps>;
  title: string;
};
