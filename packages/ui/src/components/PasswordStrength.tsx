import { Button } from "./Button";
import styles from "./PasswordStrength.module.scss";
import { Text } from "./Text";

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
        <Text
          color={check(password) ? `accent` : undefined}
          key={label}
          text={`${check(password) ? `✓ ` : ``}${label}`}
          typography="caption"
        />
      ))}
    </div>
    <div className={styles.strengthRow}>
      <Text cn={styles.strengthLabel} text={strengthLabel} typography="caption" />
      <div className={styles.strengthBar}>
        <div className={styles.strengthFill} data-strength={strength} style={{ width: strengthBarWidth }} />
      </div>
      <Text cn={styles.strengthText} text={strengthText} typography="caption" />
    </div>
    <Button disabled={disabled} onClick={onGeneratePassword} type="button">
      {generateLabel}
    </Button>
  </>
);
