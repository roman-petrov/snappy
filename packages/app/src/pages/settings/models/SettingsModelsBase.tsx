import type { AiModelItem, AiModelType } from "@snappy/ai";

import { useSettingsModelsBaseState } from "./SettingsModelsBase.state";
import { SettingsModelsBaseView } from "./SettingsModelsBase.view";

export type SettingsModelsBaseProps = {
  modelFilter?: (model: AiModelItem) => boolean;
  modelType: AiModelType;
  settingsField: `llmChatModel` | `llmImageModel` | `llmSpeechRecognitionModel` | `llmVisionModel`;
  title: string;
};

export const SettingsModelsBase = (props: SettingsModelsBaseProps) => (
  <SettingsModelsBaseView {...useSettingsModelsBaseState(props)} />
);
