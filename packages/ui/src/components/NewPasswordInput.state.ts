import { Password } from "@snappy/core";

import type { NewPasswordInputProps } from "./NewPasswordInput";

import { useToggle } from "../hooks";

export const useNewPasswordInputState = ({
  autoComplete = `new-password`,
  minLength = Password.minLength,
  onChange,
  value,
  ...rest
}: NewPasswordInputProps) => {
  const [visible, toggleVisible] = useToggle(false);
  const strength = Password.strength(value);
  const strengthBarWidth = strength === `weak` ? `33%` : strength === `medium` ? `66%` : `100%`;
  const generatePassword = () => onChange(Password.generate());

  return {
    ...rest,
    autoComplete,
    generatePassword,
    minLength,
    onChange,
    strength,
    strengthBarWidth,
    toggleVisible,
    value,
    visible,
  };
};
