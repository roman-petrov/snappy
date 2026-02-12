import { useState } from "react";

import styles from "./PasswordInput.module.css";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  autoComplete?: "current-password" | "new-password";
  required?: boolean;
  minLength?: number;
  disabled?: boolean;
};

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <svg
    className={styles[`icon`]}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
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
        <line x1="2" y1="2" x2="22" y2="22" />
      </>
    )}
  </svg>
);

export const PasswordInput = ({
  id,
  value,
  onChange,
  label,
  autoComplete = "current-password",
  required = false,
  minLength,
  disabled = false,
}: Props) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles[`field`]}>
      <label className={styles[`label`]} htmlFor={id}>
        {label}
      </label>
      <div className={styles[`wrap`]}>
        <input
          id={id}
          type={visible ? "text" : "password"}
          className={styles[`input`]}
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          disabled={disabled}
        />
        <button
          type="button"
          className={styles[`toggle`]}
          onClick={() => setVisible(v => !v)}
          disabled={disabled}
          title={visible ? "Скрыть пароль" : "Показать пароль"}
          aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
        >
          <EyeIcon visible={visible} />
        </button>
      </div>
    </div>
  );
};
