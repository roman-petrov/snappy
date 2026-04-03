import type { useSettingsModelsImageState } from "./SettingsModelsImage.state";

import { Page } from "../../components";
import { t } from "../../core";
import { SettingsOptionList } from "./components";

export type SettingsModelsImageViewProps = ReturnType<typeof useSettingsModelsImageState>;

export const SettingsModelsImageView = ({ onSelect, options, value }: SettingsModelsImageViewProps) => (
  <Page back title={t(`settings.modelsImage`)}>
    {options.length > 0 ? (
      <SettingsOptionList onSelect={onSelect} options={options} selectedValue={value} />
    ) : undefined}
  </Page>
);
