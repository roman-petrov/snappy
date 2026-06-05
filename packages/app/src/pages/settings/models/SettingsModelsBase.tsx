import type { AiModelType } from "@snappy/ai";
import type { Icon as UiIcon } from "@snappy/ui";

import { useSettingsModelsBaseState } from "./SettingsModelsBase.state";
import { SettingsModelsBaseView } from "./SettingsModelsBase.view";

export type SettingsModelsBaseProps = {
  icon: UiIcon;
  modelType: AiModelType;
  settingsField: `llmChatModel` | `llmImageModel` | `llmSpeechRecognitionModel`;
  title: string;
};

export const SettingsModelsBase = (props: SettingsModelsBaseProps) => (
  <SettingsModelsBaseView {...useSettingsModelsBaseState(props)} />
);
