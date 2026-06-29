import { Eye, EyeOff } from "lucide-react";

import type { usePasswordInputState } from "./PasswordInput.state";

import { t } from "../locales";
import { IconButton } from "./IconButton";
import { Input } from "./Input";

export type PasswordInputViewProps = ReturnType<typeof usePasswordInputState>;

export const PasswordInputView = ({
  autoComplete = `current-password`,
  disabled = false,
  label,
  onChange,
  toggleVisible,
  value,
  visible,
}: PasswordInputViewProps) => (
  <Input
    autoComplete={autoComplete}
    disabled={disabled}
    label={label}
    onChange={onChange}
    suffix={
      <IconButton
        disabled={disabled}
        icon={visible ? EyeOff : Eye}
        onClick={toggleVisible}
        tip={visible ? t(`passwordInput.hidePassword`) : t(`passwordInput.showPassword`)}
      />
    }
    type={visible ? `text` : `password`}
    value={value}
  />
);
