import { t } from "../../../core";
import { SettingsModelsBase } from "./SettingsModelsBase";

export const SettingsModelsVision = () => (
  <SettingsModelsBase
    modelFilter={model => model.capabilities.input.includes(`image`)}
    modelType="chat"
    settingsField="llmVisionModel"
    title={t(`settings.models.vision.title`)}
  />
);
