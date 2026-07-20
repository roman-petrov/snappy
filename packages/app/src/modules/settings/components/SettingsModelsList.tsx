import type { AiModelItem, AiModelType } from "@snappy/ai";

import { useSettingsModelsListState } from "./SettingsModelsList.state";
import { SettingsModelsListView } from "./SettingsModelsList.view";

export type SettingsModelsListProps = {
  modelFilter?: (model: AiModelItem) => boolean;
  modelType: AiModelType;
  select: (modelId: string) => void;
  value: string;
};

export const SettingsModelsList = (props: SettingsModelsListProps) => (
  <SettingsModelsListView {...useSettingsModelsListState(props)} />
);
