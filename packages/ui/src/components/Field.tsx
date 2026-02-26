/* eslint-disable unicorn/consistent-destructuring */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/promise-function-async */
import type { ReactNode } from "react";

import styles from "./Field.module.css";
import { Text } from "./Text";

export type FieldControlClasses = { inputClassName: string; inputInsideWrapClassName: string; wrapClassName: string };

export type FieldProps = (
  | { children: ReactNode; renderControl?: never; renderInput?: never }
  | { children?: never; renderControl: (classes: FieldControlClasses) => ReactNode; renderInput?: never }
  | { children?: never; renderControl?: never; renderInput: (inputClassName: string) => ReactNode }
) & { id: string; label?: string };

const inputClassName = `${styles.inputSurface} ${styles.input}`;
const wrapClassName = `${styles.inputSurface} ${styles.inputWrap}`;

export const Field = (props: FieldProps) => {
  const { id, label } = props;

  const content: ReactNode =
    props.renderInput === undefined
      ? props.renderControl === undefined
        ? props.children
        : props.renderControl({ inputClassName, inputInsideWrapClassName: styles.inputInsideWrap, wrapClassName })
      : props.renderInput(inputClassName);

  if (label === undefined || label === ``) {
    return content;
  }

  return (
    <div className={styles.root}>
      <Text as="label" cn={styles.label} color="body" htmlFor={id} text={label} typography="caption" />
      {content}
    </div>
  );
};
