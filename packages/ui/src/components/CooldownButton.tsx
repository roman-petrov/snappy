import type { ButtonProps } from "./Button";

import { useCooldownButtonState } from "./CooldownButton.state";
import { CooldownButtonView } from "./CooldownButton.view";

export type CooldownButtonProps = Omit<ButtonProps, `disabled` | `text`> & {
  cooldownSec: number;
  cooldownText?: (seconds: number) => string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  text?: string;
};

export const CooldownButton = (props: CooldownButtonProps) => <CooldownButtonView {...useCooldownButtonState(props)} />;
