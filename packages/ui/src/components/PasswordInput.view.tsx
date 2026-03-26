import type { usePasswordInputState } from "./PasswordInput.state";

import { t } from "../locales";
import { Icon } from "./Icon";
import { IconButton } from "./IconButton";
import { Input } from "./Input";

export type PasswordInputViewProps = ReturnType<typeof usePasswordInputState>;

export const PasswordInputView = ({
  autoComplete = `current-password`,
  disabled = false,
  label,
  minLength,
  onChange,
  required = false,
  toggleVisible,
  value,
  visible,
}: PasswordInputViewProps) => (
  <Input
    autoComplete={autoComplete}
    disabled={disabled}
    label={label}
    minLength={minLength}
    onChange={onChange}
    required={required}
    suffix={
      <IconButton
        disabled={disabled}
        icon={<Icon name={visible ? `eye-closed` : `eye-open`} />}
        onClick={toggleVisible}
        tip={visible ? t(`passwordInput.hidePassword`) : t(`passwordInput.showPassword`)}
      />
    }
    type={visible ? `text` : `password`}
    value={value}
  />
);
