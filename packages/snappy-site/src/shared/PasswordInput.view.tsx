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
        <svg
          aria-hidden
          className={styles[`icon`]}
          fill="none"
          height="20"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="20"
        >
          {visible ? (
            <>
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </>
          ) : (
            <>
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
              <line x1="2" x2="22" y1="2" y2="22" />
            </>
          )}
        </svg>
      </button>
    </div>
  </div>
);
