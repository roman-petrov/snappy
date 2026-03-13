import type { ProcessButtonProps } from "./ProcessButton";

type ButtonClassKey = `btnCompact` | `btnDisabledEmpty` | `btnLoading`;

export const useProcessButtonState = ({
  compact = false,
  disabled = false,
  disabledEmpty = false,
  loading = false,
  text,
}: ProcessButtonProps) => {
  const buttonClassKeys: ButtonClassKey[] = [
    ...(compact ? ([`btnCompact`] as const) : []),
    ...(loading ? ([`btnLoading`] as const) : []),
    ...(disabledEmpty ? ([`btnDisabledEmpty`] as const) : []),
  ];

  const icon = loading ? `⋯` : `✨`;
  const label = compact ? undefined : text;

  return { ariaBusy: loading, ariaLabel: text, btnClassKeys: buttonClassKeys, disabled, icon, label, text };
};
