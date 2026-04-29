import { t } from "../../core";
import { SettingsModelsBase } from "./SettingsModelsBase";

export const SettingsModelsSpeech = () => (
  <SettingsModelsBase
    icon="record_voice_over"
    modelType="speech-recognition"
    settingsField="llmSpeechRecognitionModel"
    title={t(`settings.models.speech.title`)}
  />
);
