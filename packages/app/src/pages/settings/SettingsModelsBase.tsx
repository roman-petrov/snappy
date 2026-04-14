import type { AiModelType } from "@snappy/domain";

import { useSettingsModelsBaseState } from "./SettingsModelsBase.state";
import { SettingsModelsBaseView } from "./SettingsModelsBase.view";

type SettingsModelsBaseProps = {
  icon: string;
  modelType: AiModelType;
  settingsField: `llmChatModel` | `llmImageModel` | `llmSpeechRecognitionModel`;
  title: string;
};

export const SettingsModelsBase = (props: SettingsModelsBaseProps) => (
  <SettingsModelsBaseView {...useSettingsModelsBaseState(props)} />
);
