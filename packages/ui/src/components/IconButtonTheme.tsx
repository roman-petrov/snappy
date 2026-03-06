import { useIconButtonThemeState } from "./IconButtonTheme.state";
import { IconButtonThemeView } from "./IconButtonTheme.view";

export const IconButtonTheme = () => <IconButtonThemeView {...useIconButtonThemeState()} />;
