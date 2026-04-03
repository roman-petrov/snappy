import type { useSettingsModelsChatState } from "./SettingsModelsChat.state";

import { Page } from "../../components";
import { t } from "../../core";
import { SettingsOptionList } from "./components";

export type SettingsModelsChatViewProps = ReturnType<typeof useSettingsModelsChatState>;

export const SettingsModelsChatView = ({ onSelect, options, value }: SettingsModelsChatViewProps) => (
  <Page back title={t(`settings.modelsChat`)}>
    {options.length > 0 ? (
      <SettingsOptionList onSelect={onSelect} options={options} selectedValue={value} />
    ) : undefined}
  </Page>
);
