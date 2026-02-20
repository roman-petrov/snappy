import type { ReactNode } from "react";

import { Field } from "./Field";
import styles from "./Input.module.css";

export type InputProps = {
  autoComplete?: string;
  disabled?: boolean;
  id: string;
  inputClassName?: string;
  label?: string;
  minLength?: number;
  onChange: (value: string) => void;
  required?: boolean;
  suffix?: ReactNode;
  type?: "email" | "password" | "text";
  value: string;
};

export const Input = ({
  autoComplete,
  disabled = false,
  id,
  inputClassName,
  label,
  minLength,
  onChange,
  required = false,
  suffix,
  type = "text",
  value,
}: InputProps) => {
  const renderControl = ({
    inputClassName: inputClassNameBase,
    inputInsideWrapClassName,
    wrapClassName,
  }: {
    inputClassName: string;
    inputInsideWrapClassName: string;
    wrapClassName: string;
  }) => {
    const inputEl = (
      <input
        autoComplete={autoComplete}
        className={
          suffix !== undefined
            ? `${inputClassNameBase} ${inputInsideWrapClassName}`
            : (inputClassName ?? inputClassNameBase)
        }
        disabled={disabled}
        id={id}
        minLength={minLength}
        onChange={ev => onChange(ev.target.value)}
        required={required}
        type={type}
        value={value}
      />
    );

    if (suffix !== undefined) {
      return (
        <div className={wrapClassName}>
          {inputEl}
          <div className={styles.suffix}>{suffix}</div>
        </div>
      );
    }

    return inputEl;
  };

  return <Field id={id} label={label} renderControl={renderControl} />;
};
