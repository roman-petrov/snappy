import { Field } from "./Field";
import styles from "./Textarea.module.css";

export type TextareaProps = {
  disabled?: boolean;
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

export const Textarea = ({ disabled = false, id, label, onChange, placeholder, value }: TextareaProps) => {
  const renderControl = ({
    inputClassName: inputClassNameBase,
  }: {
    inputClassName: string;
    inputInsideWrapClassName: string;
    wrapClassName: string;
  }) => (
    <textarea
      className={`${inputClassNameBase} ${styles.input}`}
      disabled={disabled}
      id={id}
      onChange={event_ => onChange(event_.target.value)}
      placeholder={placeholder}
      value={value}
    />
  );

  return <Field id={id} label={label} renderControl={renderControl} />;
};
