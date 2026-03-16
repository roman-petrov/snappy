import { _ } from "@snappy/core";

import type { useInputState } from "./Input.state";

import { $ } from "../$";
import styles from "./Input.module.scss";

export type InputViewProps = ReturnType<typeof useInputState>;

export const InputView = ({
  autoComplete,
  disabled = false,
  id,
  label,
  minLength,
  onChange,
  onFocus,
  required = false,
  suffix,
  type = `text`,
  value,
}: InputViewProps) => {
  const hasValue = value.length > 0;
  const inputClassName = _.cn(styles.input, $.typography(`body`), styles.inputInsideWrap);

  const inputElement = (
    <input
      autoComplete={autoComplete}
      className={inputClassName}
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

  const wrapClassName = _.cn(styles.inputSurface, styles.inputWrap, hasValue && styles.hasValue);

  return (
    <div className={styles.root}>
      <div className={wrapClassName}>
        <div className={styles.inputSlot}>
          {suffix === undefined ? (
            inputElement
          ) : (
            <div className={styles.inputWrap}>
              {inputElement}
              <div className={styles.suffix}>{suffix}</div>
            </div>
          )}
        </div>
        <label className={styles.floatingLabel} htmlFor={id}>
          {label}
        </label>
      </div>
    </div>
  );
};
