import type { CheckboxProps } from "./Checkbox";

import { useToggleHaptic } from "../hooks";

export const useCheckboxState = ({ checked = false, children, cn, onChange, ...tapProps }: CheckboxProps) => {
  const { disabled = false, onClick, ...restTap } = tapProps;

  useToggleHaptic(checked, disabled);

  const onActivate = () => {
    onClick?.();
    onChange?.(!checked);
  };

  return { checked, children, cn, disabled, onActivate, tapProps: { ...restTap, disabled } };
};
