import { t } from "../../../../core";
import { SettingsModelsBase } from "../../components";

export const SettingsModelsChat = () => (
  <SettingsModelsBase modelType="chat" settingsField="llmChatModel" title={t(`settings.models.chat.title`)} />
);
