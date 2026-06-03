import { Mic } from "lucide-react";

import { t } from "../../core";
import { SettingsModelsBase } from "./SettingsModelsBase";

export const SettingsModelsSpeech = () => (
  <SettingsModelsBase
    icon={Mic}
    modelType="speech-recognition"
    settingsField="llmSpeechRecognitionModel"
    title={t(`settings.models.speech.title`)}
  />
);
