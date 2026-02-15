import styles from "./Input.module.css";

export type InputProps = {
  autoComplete?: string;
  cn?: string;
  disabled?: boolean;
  id: string;
  inputClassName?: string;
  label?: string;
  minLength?: number;
  onChange: (value: string) => void;
  required?: boolean;
  type?: `email` | `password` | `text`;
  value: string;
};

export const Input = ({
  autoComplete,
  cn = ``,
  disabled = false,
  id,
  inputClassName,
  label,
  minLength,
  onChange,
  required = false,
  type = `text`,
  value,
}: InputProps) => {
  const inputElement = (
    <input
      autoComplete={autoComplete}
      className={inputClassName ?? styles.input}
      disabled={disabled}
      id={id}
      minLength={minLength}
      onChange={event => onChange(event.target.value)}
      required={required}
      type={type}
      value={value}
    />
  );

  if (label === undefined) {
    return inputElement;
  }

  return (
    <div className={cn ? `${styles.field} ${cn}`.trim() : styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {inputElement}
    </div>
  );
};
