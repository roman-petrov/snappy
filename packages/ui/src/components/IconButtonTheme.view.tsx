import type { useIconButtonThemeState } from "./IconButtonTheme.state";

import { IconButton } from "./IconButton";

export type IconButtonThemeViewProps = ReturnType<typeof useIconButtonThemeState>;

export const IconButtonThemeView = ({ ariaLabel, icon, onClick }: IconButtonThemeViewProps) => (
  <IconButton ariaLabel={ariaLabel} icon={icon} onClick={onClick} />
);
