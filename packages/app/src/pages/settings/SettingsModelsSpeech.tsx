import { t } from "../../core";
import { SettingsModelsBase } from "./SettingsModelsBase";

export const SettingsModelsSpeech = () => (
  <SettingsModelsBase
    icon="🎙️"
    modelType="speech-recognition"
    settingsField="llmSpeechRecognitionModel"
    title={t(`settings.modelsSpeech`)}
  />
);
