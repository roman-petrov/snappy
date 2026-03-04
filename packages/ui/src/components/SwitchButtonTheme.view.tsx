import type { useSwitchButtonThemeState } from "./SwitchButtonTheme.state";

import { SwitchButton } from "./SwitchButton";

export type SwitchButtonThemeViewProps = ReturnType<typeof useSwitchButtonThemeState>;

export const SwitchButtonThemeView = ({ ariaLabel, label, onClick }: SwitchButtonThemeViewProps) => (
  <SwitchButton ariaLabel={ariaLabel} label={label} onClick={onClick} />
);
