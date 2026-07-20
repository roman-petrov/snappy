import type { AiModelCost } from "@snappy/ai";

import { Chip, type ChipColor } from "@snappy/ui";

import type { useSettingsModelsListState } from "./SettingsModelsList.state";

import { t } from "../../../core";
import { SettingsCard } from "./SettingsCard";
import { SettingsCards } from "./SettingsCards";
import { SettingsOptionRows } from "./SettingsOptionRows";

export type SettingsModelsListViewProps = ReturnType<typeof useSettingsModelsListState>;

const chipColor: Record<AiModelCost, ChipColor> = { high: `error`, low: `success`, medium: `warning` };

export const SettingsModelsListView = ({ groups, select, value }: SettingsModelsListViewProps) => (
  <SettingsCards>
    {groups.map(group => (
      <SettingsCard
        key={group.cost}
        title={<Chip color={chipColor[group.cost]} flat text={t(`settings.models.cost.${group.cost}`)} />}
      >
        <SettingsOptionRows options={group.options} select={select} value={value} />
      </SettingsCard>
    ))}
  </SettingsCards>
);
