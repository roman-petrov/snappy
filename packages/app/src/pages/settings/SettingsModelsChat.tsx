import { t } from "../../core";
import { SettingsModelsBase } from "./SettingsModelsBase";

export const SettingsModelsChat = () => (
  <SettingsModelsBase icon="🤖" modelType="chat" settingsField="llmChatModel" title={t(`settings.modelsChat`)} />
);
