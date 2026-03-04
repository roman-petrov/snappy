import type { useSwitchButtonLocaleState } from "./SwitchButtonLocale.state";

import { SwitchButton } from "./SwitchButton";
import { Text } from "./Text";

export type SwitchButtonLocaleViewProps = ReturnType<typeof useSwitchButtonLocaleState>;

export const SwitchButtonLocaleView = ({ ariaLabel, label, onClick }: SwitchButtonLocaleViewProps) => (
  <SwitchButton ariaLabel={ariaLabel} label={<Text as="span" text={label} typography="caption" />} onClick={onClick} />
);
