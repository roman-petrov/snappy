import type { useTextAreaState } from "./TextArea.state";

import styles from "./TextArea.module.scss";

export type TextAreaViewProps = ReturnType<typeof useTextAreaState>;

export const TextAreaView = ({
  blur,
  disabled = false,
  focus,
  onChange,
  placeholder,
  readOnly = false,
  ref,
  value,
}: TextAreaViewProps) => (
  <textarea
    className={styles.root}
    disabled={disabled}
    onBlur={blur}
    onChange={event => onChange?.(event.currentTarget.value)}
    onFocus={focus}
    placeholder={placeholder}
    readOnly={readOnly}
    ref={ref}
    rows={1}
    value={value}
  />
);
