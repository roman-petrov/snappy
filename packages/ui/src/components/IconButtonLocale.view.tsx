import type { useIconButtonLocaleState } from "./IconButtonLocale.state";

import { IconButton } from "./IconButton";

export type IconButtonLocaleViewProps = ReturnType<typeof useIconButtonLocaleState>;

export const IconButtonLocaleView = ({ ariaLabel, icon, onClick }: IconButtonLocaleViewProps) => (
  <IconButton ariaLabel={ariaLabel} icon={icon} onClick={onClick} />
);
