/* eslint-disable @typescript-eslint/promise-function-async */
import { Icon, Page } from "@snappy/ui";
import { Check, Star } from "lucide-react";

import type { useSettingsModelsImageState } from "./SettingsModelsImage.state";

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
  <Page back title={t(`settings.models.image.title`)}>
    <SettingsCards>
      <SettingsCard title={t(`settings.models.image.title`)}>
        {modelOptions.map((option, index) => (
          <div key={option.value}>
            {index > 0 && <SettingsCardSeparator />}
            <SettingsCardRow
              icon={option.icon}
              onClick={async () => onModelSelect(option.value)}
              right={modelValue === option.value ? <Icon color="primary" icon={Check} /> : undefined}
              text={option.label}
            />
          </div>
        ))}
      </SettingsCard>
      <SettingsCard title={t(`settings.models.image.quality`)}>
        {qualityOptions.map((value, index) => (
          <div key={value}>
            {index > 0 && <SettingsCardSeparator />}
            <SettingsCardRow
              icon={Star}
              onClick={() => onQualitySelect(value)}
              right={qualityValue === value ? <Icon color="primary" icon={Check} /> : undefined}
              text={t(`settings.models.image.qualityValue.${value}`)}
            />
          </div>
        ))}
      </SettingsCard>
    </SettingsCards>
  </Page>
);
