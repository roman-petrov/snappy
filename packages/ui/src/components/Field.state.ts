import type { FieldProps } from "./Field";

import { $ } from "../$";
import styles from "./Field.module.scss";

export type FieldControlClasses = {
  innerWrapClassName: string;
  inputClassName: string;
  inputInsideWrapClassName: string;
  wrapClassName: string;
};

const inputBase = `${styles.inputSurface} ${styles.input} ${$.typography(`body`)}`;
const inputFloating = `${styles.input} ${$.typography(`body`)} ${styles.inputInsideWrap}`;
const wrapFull = `${styles.inputSurface} ${styles.inputWrap}`;
const wrapInner = styles.inputWrap;

export const useFieldState = (props: FieldProps) => {
  const hasLabel = props.label !== undefined && props.label !== ``;
  const hasValue = props.value !== undefined && props.value.length > 0;

  const classes: FieldControlClasses = {
    innerWrapClassName: wrapInner,
    inputClassName: hasLabel ? inputFloating : inputBase,
    inputInsideWrapClassName: styles.inputInsideWrap,
    wrapClassName: hasLabel ? wrapInner : wrapFull,
  };

  return { ...props, classes, hasLabel, hasValue };
};
