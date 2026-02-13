import { Button } from "./Button";
import styles from "./PasswordStrength.module.css";

export type PasswordStrengthProps = {
  disabled?: boolean;
  generateLabel: string;
  onGeneratePassword: () => void;
  password: string;
  requirements: readonly { check: (s: string) => boolean; label: string }[];
  strength: `medium` | `strong` | `weak`;
  strengthBarWidth: string;
  strengthLabel: string;
  strengthText: string;
};

export const PasswordStrength = ({
  disabled = false,
  generateLabel,
  onGeneratePassword,
  password,
  requirements,
  strength,
  strengthBarWidth,
  strengthLabel,
  strengthText,
}: PasswordStrengthProps) => (
  <>
    <div className={styles.requirements}>
      {requirements.map(({ check, label }) => (
        <span className={check(password) ? styles.requirementMet : styles.requirement} key={label}>
          {check(password) ? `✓ ` : ``}
          {label}
        </span>
      ))}
    </div>
    <div className={styles.strengthRow}>
      <span className={styles.strengthLabel}>{strengthLabel}</span>
      <div className={styles.strengthBar}>
        <div className={styles.strengthFill} data-strength={strength} style={{ width: strengthBarWidth }} />
      </div>
      <span className={styles.strengthText}>{strengthText}</span>
    </div>
    <Button disabled={disabled} onClick={onGeneratePassword} type="button">
      {generateLabel}
    </Button>
  </>
);
