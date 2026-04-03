import type { useSettingsModelsSpeechState } from "./SettingsModelsSpeech.state";

import { Page } from "../../components";
import { t } from "../../core";
import { SettingsOptionList } from "./components";

export type SettingsModelsSpeechViewProps = ReturnType<typeof useSettingsModelsSpeechState>;

export const SettingsModelsSpeechView = ({ onSelect, options, value }: SettingsModelsSpeechViewProps) => (
  <Page back title={t(`settings.modelsSpeech`)}>
    {options.length > 0 ? (
      <SettingsOptionList onSelect={onSelect} options={options} selectedValue={value} />
    ) : undefined}
  </Page>
);
