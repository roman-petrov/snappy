import type { SmallButtonProps } from "./SmallButton";

type ButtonClassKey = `btnCompact` | `btnCopy` | `btnFull` | `btnNeutral`;

const variantClassKey: Record<SmallButtonProps[`variant`], ButtonClassKey> = { copy: `btnCopy`, neutral: `btnNeutral` };

export const useSmallButtonState = ({
  compact = false,
  disabled = false,
  full = false,
  icon,
  label,
  onClick,
  title,
  variant,
}: SmallButtonProps) => {
  const buttonClassKeys: ButtonClassKey[] = [
    variantClassKey[variant],
    ...(compact ? ([`btnCompact`] as const) : []),
    ...(full ? ([`btnFull`] as const) : []),
  ];

  const buttonLabel = compact ? undefined : label;

  return { buttonClassKeys, buttonLabel, disabled, icon, onClick, title };
};
