/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { usePasswordInputState } from "./PasswordInput.state";

import { Icon } from "./Icon";
import { Input } from "./Input";
import styles from "./PasswordInput.module.css";

export type PasswordInputViewProps = ReturnType<typeof usePasswordInputState>;

export const PasswordInputView = ({
  ariaLabel,
  autoComplete = "current-password",
  disabled = false,
  id,
  inputType,
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
    id={id}
    label={label}
    minLength={minLength}
    onChange={onChange}
    required={required}
    suffix={
      <button aria-label={ariaLabel} disabled={disabled} onClick={toggleVisible} title={ariaLabel} type="button">
        <Icon cn={styles.icon} name={visible ? "eye-closed" : "eye-open"} />
      </button>
    }
    type={inputType as "password" | "text"}
    value={value}
  />
);
