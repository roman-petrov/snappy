import type { useTextareaState } from "./Textarea.state";

import { Field } from "./Field";
import styles from "./Textarea.module.scss";

export type TextareaViewProps = ReturnType<typeof useTextareaState>;

export const TextareaView = ({
  disabled = false,
  id,
  label,
  onChange,
  onFocus,
  placeholder,
  value,
}: TextareaViewProps) => (
  <Field
    id={id}
    label={label}
    renderInput={cn => (
      <textarea
        className={`${cn} ${styles.input}`}
        disabled={disabled}
        id={id}
        onChange={event_ => onChange(event_.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        value={value}
      />
    )}
  />
);
