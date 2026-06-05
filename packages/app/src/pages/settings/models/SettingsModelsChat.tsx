import { Bot } from "lucide-react";

import { t } from "../../../core";
import { SettingsModelsBase } from "./SettingsModelsBase";

export const SettingsModelsChat = () => (
  <SettingsModelsBase
    icon={Bot}
    modelType="chat"
    settingsField="llmChatModel"
    title={t(`settings.models.chat.title`)}
  />
);
