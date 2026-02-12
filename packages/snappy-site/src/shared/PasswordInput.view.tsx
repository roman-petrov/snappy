import type { usePasswordInputState } from "./PasswordInput.state";

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
  <div className={styles[`field`]}>
    <label className={styles[`label`]} htmlFor={id}>
      {label}
    </label>
    <div className={styles[`wrap`]}>
      <input
        autoComplete={autoComplete}
        className={styles[`input`]}
        disabled={disabled}
        id={id}
        minLength={minLength}
        onChange={e => onChange(e.target.value)}
        required={required}
        type={inputType}
        value={value}
      />
      <button
        aria-label={ariaLabel}
        className={styles[`toggle`]}
        disabled={disabled}
        onClick={toggleVisible}
        title={ariaLabel}
        type="button"
      >
        <span aria-hidden className={styles[`icon`]}>
          {visible ? `👀` : `👁`}
        </span>
      </button>
    </div>
  </div>
);
