import type { CooldownButtonProps } from "./CooldownButton";

export const useCooldownButtonState = ({
  cooldownSec,
  cooldownText,
  disabled = false,
  loading = false,
  loadingText,
  text,
  ...buttonProps
}: CooldownButtonProps) => {
  const onCooldown = cooldownSec > 0;
  const label = loading && loadingText !== undefined ? loadingText : onCooldown ? cooldownText(cooldownSec) : text;

  return { ...buttonProps, disabled: disabled || loading || onCooldown, text: label };
};
