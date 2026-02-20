/* eslint-disable @typescript-eslint/promise-function-async */
import type { ReactNode } from "react";

import styles from "./Field.module.css";

export type FieldControlClasses = { inputClassName: string; inputInsideWrapClassName: string; wrapClassName: string };

export const fieldControl =
  (render: (inputClassName: string) => ReactNode) =>
  (classes: FieldControlClasses): ReactNode =>
    render(classes.inputClassName);

export type FieldProps = (
  | { children: ReactNode; renderControl?: never }
  | { children?: never; renderControl: (classes: FieldControlClasses) => ReactNode }
) & { id: string; label?: string };

export const Field = (props: FieldProps) => {
  const { id, label } = props;
  const hasRenderControl = `renderControl` in props && props.renderControl !== undefined;

  const content = hasRenderControl
    ? props.renderControl({
        inputClassName: `${styles.inputSurface} ${styles.input}`,
        inputInsideWrapClassName: styles.inputInsideWrap,
        wrapClassName: `${styles.inputSurface} ${styles.inputWrap}`,
      })
    : props.children;

  if (label === undefined || label === ``) {
    return content;
  }

  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {content}
    </div>
  );
};
