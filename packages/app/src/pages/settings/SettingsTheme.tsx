import { useSettingsThemeState } from "./SettingsTheme.state";
import { SettingsThemeView } from "./SettingsTheme.view";

export const SettingsTheme = () => <SettingsThemeView {...useSettingsThemeState()} />;
