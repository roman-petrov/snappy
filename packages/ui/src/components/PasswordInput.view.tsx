/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { usePasswordInputState } from "./PasswordInput.state";

import eyeClosed from "../assets/eye-closed.svg";
import eyeOpen from "../assets/eye-open.svg";
import { Input } from "./Input";
import inputStyles from "./Input.module.css";
import styles from "./PasswordInput.module.css";

export type PasswordInputViewProps = ReturnType<typeof usePasswordInputState>;

export const PasswordInputView = ({
  ariaLabel,
  autoComplete = `current-password`,
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
  <div className={inputStyles.field}>
    <label className={inputStyles.label} htmlFor={id}>
      {label}
    </label>
    <div className={styles.wrap}>
      <Input
        autoComplete={autoComplete}
        disabled={disabled}
        id={id}
        inputClassName={styles.input}
        minLength={minLength}
        onChange={onChange}
        required={required}
        type={inputType as `password` | `text`}
        value={value}
      />
      <button
        aria-label={ariaLabel}
        className={styles.toggle}
        disabled={disabled}
        onClick={toggleVisible}
        title={ariaLabel}
        type="button"
      >
        <img alt="" aria-hidden className={styles.icon} src={visible ? eyeClosed : eyeOpen} />
      </button>
    </div>
  </div>
);
