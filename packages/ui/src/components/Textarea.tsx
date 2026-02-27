import { Field } from "./Field";
import styles from "./Textarea.module.scss";

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
    renderInput={cn => (
      <textarea
        className={`${cn} ${styles.input}`}
        disabled={disabled}
        id={id}
        onChange={event_ => onChange(event_.target.value)}
        placeholder={placeholder}
        value={value}
      />
    )}
  />
);
