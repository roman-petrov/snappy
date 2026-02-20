import type { ReactNode } from "react";

import type { FieldControlClasses } from "./Field";

import { Field } from "./Field";
import styles from "./Input.module.css";

export type InputProps =
  | {
      autoComplete?: string;
      children?: never;
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
    }
  | {
      children: (classes: FieldControlClasses) => ReactNode;
      disabled?: boolean;
      id: string;
      label?: string;
      suffix?: ReactNode;
    };

export const Input = (props: InputProps) => {
  const { id, label, suffix } = props;

  const renderControl = ({
    inputClassName: inputClassNameBase,
    inputInsideWrapClassName,
    wrapClassName,
  }: FieldControlClasses) => {
    if (typeof props.children === `function`) {
      return (
        <div className={wrapClassName}>
          {props.children({ inputClassName: inputClassNameBase, inputInsideWrapClassName, wrapClassName })}
          {suffix === undefined ? undefined : (
            <div className={styles.suffix}>
              <div className={styles.suffixIcon}>{suffix}</div>
            </div>
          )}
        </div>
      );
    }

    const {
      autoComplete,
      disabled = false,
      inputClassName,
      minLength,
      onChange,
      required = false,
      type = `text`,
      value,
    } = props;

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
          <div className={styles.suffix}>
            <div className={styles.suffixIcon}>{suffix}</div>
          </div>
        </div>
      );
    }

    return inputElement;
  };

  return <Field id={id} label={label} renderControl={renderControl} />;
};
