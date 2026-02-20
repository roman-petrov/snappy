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
  type?: `email` | `password` | `text`;
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
  type = `text`,
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
    const inputElement = (
      <input
        autoComplete={autoComplete}
        className={
          suffix === undefined
            ? (inputClassName ?? inputClassNameBase)
            : `${inputClassNameBase} ${inputInsideWrapClassName}`
        }
        disabled={disabled}
        id={id}
        minLength={minLength}
        onChange={event_ => onChange(event_.target.value)}
        required={required}
        type={type}
        value={value}
      />
    );

    if (suffix !== undefined) {
      return (
        <div className={wrapClassName}>
          {inputElement}
          <div className={styles.suffix}>{suffix}</div>
        </div>
      );
    }

    return inputElement;
  };

  return <Field id={id} label={label} renderControl={renderControl} />;
};
