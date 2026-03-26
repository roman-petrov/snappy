import type { useTextAreaState } from "./TextArea.state";

import styles from "./TextArea.module.scss";

export type TextAreaViewProps = ReturnType<typeof useTextAreaState>;

export const TextAreaView = ({
  blur,
  disabled = false,
  focus,
  onTextChange,
  placeholder,
  textareaRef,
  value,
}: TextAreaViewProps) => (
  <textarea
    className={styles.root}
    disabled={disabled}
    onBlur={blur}
    onChange={event => onTextChange(event.currentTarget.value)}
    onFocus={focus}
    placeholder={placeholder}
    ref={textareaRef}
    rows={1}
    value={value}
  />
);
