/* eslint-disable react/destructuring-assignment */
/* eslint-disable unicorn/consistent-destructuring */

import type { useInputState } from "./Input.state";

import { Field, type FieldControlClasses } from "./Field";
import styles from "./Input.module.scss";

export type InputViewProps = ReturnType<typeof useInputState>;

export const InputView = (props: InputViewProps) => {
  const { id, label, onFocus, suffix } = props;

  const renderControl = ({
    innerWrapClassName,
    inputClassName: inputClassNameBase,
    inputInsideWrapClassName,
    wrapClassName,
  }: FieldControlClasses) => {
    if (props.children !== undefined) {
      return (
        <div className={wrapClassName}>
          {props.children({
            innerWrapClassName,
            inputClassName: inputClassNameBase,
            inputInsideWrapClassName,
            wrapClassName,
          })}
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
        onFocus={onFocus}
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

  return <Field id={id} label={label} renderControl={renderControl} value={props.value} />;
};
