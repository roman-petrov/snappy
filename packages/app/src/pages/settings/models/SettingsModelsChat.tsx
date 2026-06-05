import { t } from "../../../core";
import { SettingsModelsBase } from "./SettingsModelsBase";

export const SettingsModelsChat = () => (
  <SettingsModelsBase modelType="chat" settingsField="llmChatModel" title={t(`settings.models.chat.title`)} />
);
