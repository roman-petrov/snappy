import { Page } from "@snappy/ui";
import { Star } from "lucide-react";

import type { useSettingsModelsImageState } from "./SettingsModelsImage.state";

import { t } from "../../core";
import { SettingsCard, SettingsCards, SettingsOptionRows } from "./components";

export type SettingsModelsImageViewProps = ReturnType<typeof useSettingsModelsImageState>;

export const SettingsModelsImageView = ({
  modelOptions,
  modelValue,
  onModelSelect,
  onQualitySelect,
  qualityOptions,
  qualityValue,
}: SettingsModelsImageViewProps) => (
  <Page back title={t(`settings.models.image.title`)}>
    <SettingsCards>
      <SettingsCard title={t(`settings.models.image.title`)}>
        <SettingsOptionRows onSelect={onModelSelect} options={modelOptions} value={modelValue} />
      </SettingsCard>
      <SettingsCard title={t(`settings.models.image.quality`)}>
        <SettingsOptionRows
          onSelect={onQualitySelect}
          options={qualityOptions.map(value => ({
            icon: Star,
            label: t(`settings.models.image.qualityValue.${value}`),
            value,
          }))}
          value={qualityValue}
        />
      </SettingsCard>
    </SettingsCards>
  </Page>
);
