import type { CooldownButtonProps } from "./CooldownButton";

import { t } from "../locales";

export const useCooldownButtonState = ({
  cooldownSec,
  cooldownText = seconds => t(`cooldownButton.resendIn`, { seconds }),
  disabled = false,
  loading = false,
  loadingText,
  text = t(`cooldownButton.resend`),
  ...buttonProps
}: CooldownButtonProps) => {
  const onCooldown = cooldownSec > 0;
  const label = loading && loadingText !== undefined ? loadingText : onCooldown ? cooldownText(cooldownSec) : text;

  return { ...buttonProps, disabled: disabled || loading || onCooldown, text: label };
};
