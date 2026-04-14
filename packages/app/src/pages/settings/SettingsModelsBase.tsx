import type { AiModelType } from "@snappy/ai";

import { useSettingsModelsBaseState } from "./SettingsModelsBase.state";
import { SettingsModelsBaseView } from "./SettingsModelsBase.view";

export type SettingsModelsBaseProps = {
  icon: string;
  modelType: AiModelType;
  settingsField: `llmChatModel` | `llmImageModel` | `llmSpeechRecognitionModel`;
  title: string;
};

export const SettingsModelsBase = (props: SettingsModelsBaseProps) => (
  <SettingsModelsBaseView {...useSettingsModelsBaseState(props)} />
);
