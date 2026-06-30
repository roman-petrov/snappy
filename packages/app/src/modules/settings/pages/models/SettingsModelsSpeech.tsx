import { t } from "../../../../core";
import { SettingsModelsBase } from "../../components";

export const SettingsModelsSpeech = () => (
  <SettingsModelsBase
    modelType="speech-recognition"
    settingsField="llmSpeechRecognitionModel"
    title={t(`settings.models.speech.title`)}
  />
);
