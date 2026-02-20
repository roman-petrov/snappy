import { Field, fieldControl } from "./Field";
import styles from "./Textarea.module.css";

export type TextareaProps = {
  disabled?: boolean;
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

export const Textarea = ({ disabled = false, id, label, onChange, placeholder, value }: TextareaProps) => (
  <Field
    id={id}
    label={label}
    renderControl={fieldControl(cn => (
      <textarea
        className={`${cn} ${styles.input}`}
        disabled={disabled}
        id={id}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        value={value}
      />
    ))}
  />
);
