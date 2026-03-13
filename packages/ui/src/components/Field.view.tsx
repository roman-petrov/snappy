/* eslint-disable @typescript-eslint/promise-function-async */
import type { ReactNode } from "react";

import type { useFieldState } from "./Field.state";

import styles from "./Field.module.scss";

export type FieldViewProps = ReturnType<typeof useFieldState>;

export const FieldView = ({ children, classes, hasLabel, hasValue, id, label, renderControl }: FieldViewProps) => {
  const content: ReactNode = renderControl === undefined ? children : renderControl(classes);

  if (!hasLabel) {
    return content;
  }

  const wrapClasses = [styles.inputSurface, styles.inputWrap, styles.hasFloatingLabel, hasValue ? styles.hasValue : ``]
    .filter(Boolean)
    .join(` `);

  return (
    <div className={styles.root}>
      <div className={wrapClasses} data-has-value={hasValue || undefined}>
        <label className={styles.floatingLabel} htmlFor={id}>
          {label}
        </label>
        <div className={styles.inputSlot}>{content}</div>
      </div>
    </div>
  );
};
