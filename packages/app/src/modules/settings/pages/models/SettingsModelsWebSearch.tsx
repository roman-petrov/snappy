import { t } from "../../../../core";
import { SettingsModelsBase } from "../../components";

export const SettingsModelsWebSearch = () => (
  <SettingsModelsBase
    modelFilter={model => model.capabilities.webSearch === true}
    modelType="chat"
    settingsField="llmWebSearchModel"
    title={t(`settings.models.webSearch.title`)}
  />
);
