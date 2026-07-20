import { Page } from "@snappy/ui";

import type { useSettingsModelsImageState } from "./SettingsModelsImage.state";

import { t } from "../../../../core";
import { SettingsCard, SettingsCards, SettingsModelsList, SettingsOptionRows } from "../../components";

export type SettingsModelsImageViewProps = ReturnType<typeof useSettingsModelsImageState>;

export const SettingsModelsImageView = ({
  modelValue,
  qualityOptions,
  qualityValue,
  selectModel,
  selectQuality,
}: SettingsModelsImageViewProps) => (
  <Page back title={t(`settings.models.image.title`)}>
    <SettingsModelsList modelType="image" select={selectModel} value={modelValue} />
    <SettingsCards>
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
