import { _ } from "@snappy/core";

import type { useInputState } from "./Input.state";

import { $ } from "../$";
import styles from "./Input.module.scss";

export type InputViewProps = ReturnType<typeof useInputState>;

export const InputView = ({
  autoComplete,
  disabled = false,
  id,
  inputMode,
  label,
  onBlur,
  onChange,
  overlay,
  suffix,
  type = `text`,
  value,
}: InputViewProps) => {
  const hasValue = value.length > 0;

  const inputElement = (
    <input
      autoComplete={autoComplete}
      className={styles.control}
      disabled={disabled}
      id={id}
      inputMode={inputMode}
      onBlur={onBlur}
      onChange={event => onChange?.(event.target.value)}
      type={type}
      value={value}
    />
  );

  const field = (
    <div className={styles.field}>
      {inputElement}
      {overlay}
    </div>
  );

  const surfaceClassName = _.cn(styles.surface, $.surface(`surface`), $.elevation(`e1`), hasValue && styles.hasValue);

  return (
    <div className={surfaceClassName}>
      <div className={styles.slot}>
        {suffix === undefined ? (
          field
        ) : (
          <div className={styles.row}>
            {field}
            <div className={styles.suffix}>{suffix}</div>
          </div>
        )}
      </div>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
    </div>
  );
};
