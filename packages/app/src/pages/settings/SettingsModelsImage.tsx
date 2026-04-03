import { t } from "../../core";
import { SettingsModelsBase } from "./SettingsModelsBase";

export const SettingsModelsImage = () => (
  <SettingsModelsBase icon="🎨" modelType="image" settingsField="llmImageModel" title={t(`settings.modelsImage`)} />
);
