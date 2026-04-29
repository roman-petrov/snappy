import type { SwitchProps } from "./Switch";

export const useSwitchState = ({ checked = false, onChange, ...tapProps }: SwitchProps) => {
  const { onClick, ...restTap } = tapProps;

  const onActivate = () => {
    onClick?.();
    onChange?.(!checked);
  };

  return { checked, onActivate, tapProps: restTap };
};
