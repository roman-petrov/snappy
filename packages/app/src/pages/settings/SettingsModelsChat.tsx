import { useSettingsModelsChatState } from "./SettingsModelsChat.state";
import { SettingsModelsChatView } from "./SettingsModelsChat.view";

export const SettingsModelsChat = () => <SettingsModelsChatView {...useSettingsModelsChatState()} />;
