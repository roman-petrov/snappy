/* eslint-disable @typescript-eslint/promise-function-async */
import type { useSettingsModelsImageState } from "./SettingsModelsImage.state";

import { Page } from "../../components";
import { t } from "../../core";
import { SettingsCard, SettingsCardRow, SettingsCards, SettingsCardSeparator } from "./components";

export type SettingsModelsImageViewProps = ReturnType<typeof useSettingsModelsImageState>;

export const SettingsModelsImageView = ({
  modelOptions,
  modelValue,
  onModelSelect,
  onQualitySelect,
  qualityOptions,
  qualityValue,
}: SettingsModelsImageViewProps) => (
  <Page back title={t(`settings.modelsImage`)}>
    <SettingsCards>
      <SettingsCard title={t(`settings.modelsImage`)}>
        {modelOptions.map((option, index) => (
          <div key={option.value}>
            {index > 0 && <SettingsCardSeparator />}
            <SettingsCardRow
              ariaPressed={modelValue === option.value}
              end={modelValue === option.value ? `✓` : undefined}
              icon={option.icon}
              onClick={async () => onModelSelect(option.value)}
              text={option.label}
            />
          </div>
        ))}
      </SettingsCard>
      <SettingsCard title={t(`settings.imageQuality`)}>
        {qualityOptions.map((value, index) => (
          <div key={value}>
            {index > 0 && <SettingsCardSeparator />}
            <SettingsCardRow
              ariaPressed={qualityValue === value}
              end={qualityValue === value ? `✓` : undefined}
              icon="✨"
              onClick={() => onQualitySelect(value)}
              text={t(`settings.imageQualityValue.${value}`)}
            />
          </div>
        ))}
      </SettingsCard>
    </SettingsCards>
  </Page>
);
