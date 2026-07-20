import { type AiModelCost, AiModels } from "@snappy/ai";

import type { SettingsModelsListProps } from "./SettingsModelsList";

const costs: readonly AiModelCost[] = [`low`, `medium`, `high`];

export const useSettingsModelsListState = ({ modelFilter, modelType, select, value }: SettingsModelsListProps) => {
  const models = AiModels.items.filter(
    entry => entry.type === modelType && entry.cost !== undefined && (modelFilter === undefined || modelFilter(entry)),
  );

  const groups = costs
    .map(cost => ({
      cost,
      options: models
        .filter(entry => entry.cost === cost)
        .toSorted((a, b) => a.name.localeCompare(b.name))
        .map(entry => ({ label: entry.name, value: entry.name })),
    }))
    .filter(group => group.options.length > 0);

  return { groups, select, value };
};
