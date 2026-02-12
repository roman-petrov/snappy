import type { usePasswordInputState } from "./PasswordInput.state";

import eyeClosedSvg from "../app/assets/eye-closed.svg?raw";
import eyeOpenSvg from "../app/assets/eye-open.svg?raw";
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
  <div className={inputStyles[`field`]}>
    <label className={inputStyles[`label`]} htmlFor={id}>
      {label}
    </label>
    <div className={styles[`wrap`]}>
      <Input
        autoComplete={autoComplete}
        disabled={disabled}
        id={id}
        inputClassName={styles[`input`]}
        minLength={minLength}
        onChange={onChange}
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
        <span
          aria-hidden
          className={styles[`icon`]}
          dangerouslySetInnerHTML={{
            __html: (visible ? eyeClosedSvg : eyeOpenSvg).replace(/^<svg/u, `<svg width="100%" height="100%"`),
          }}
        />
      </button>
    </div>
  </div>
);
