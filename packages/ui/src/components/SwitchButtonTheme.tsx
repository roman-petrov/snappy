import { useSwitchButtonThemeState } from "./SwitchButtonTheme.state";
import { SwitchButtonThemeView } from "./SwitchButtonTheme.view";

export const SwitchButtonTheme = () => <SwitchButtonThemeView {...useSwitchButtonThemeState()} />;
