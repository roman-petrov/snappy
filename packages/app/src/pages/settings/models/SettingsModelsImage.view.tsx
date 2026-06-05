import { Page } from "@snappy/ui";

import type { useSettingsModelsImageState } from "./SettingsModelsImage.state";

import { t } from "../../../core";
import { SettingsCard, SettingsCards, SettingsOptionRows } from "../components";

export type SettingsModelsImageViewProps = ReturnType<typeof useSettingsModelsImageState>;

export const SettingsModelsImageView = ({
  modelOptions,
  modelValue,
  qualityOptions,
  qualityValue,
  selectModel,
  selectQuality,
}: SettingsModelsImageViewProps) => (
  <Page back title={t(`settings.models.image.title`)}>
    <SettingsCards>
      <SettingsCard title={t(`settings.models.image.title`)}>
        <SettingsOptionRows options={modelOptions} select={selectModel} value={modelValue} />
      </SettingsCard>
      <SettingsCard title={t(`settings.models.image.quality`)}>
        <SettingsOptionRows
          options={qualityOptions.map(quality => ({
            label: t(`settings.models.image.qualityValue.${quality}`),
            value: quality,
          }))}
          select={selectQuality}
          value={qualityValue}
        />
      </SettingsCard>
    </SettingsCards>
  </Page>
);
