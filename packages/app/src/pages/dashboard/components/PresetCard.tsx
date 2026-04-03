import type { ApiPreset } from "@snappy/server-api";

import { usePresetCardState } from "./PresetCard.state";
import { PresetCardView } from "./PresetCard.view";

export type PresetCardProps = {
  onPick: (id: string) => void;
  preset: ApiPreset;
  selected: boolean;
  variant: `free` | `grid`;
};

export const PresetCard = (props: PresetCardProps) => <PresetCardView {...usePresetCardState(props)} />;
