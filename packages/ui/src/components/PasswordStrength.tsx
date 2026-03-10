import { Button } from "./Button";
import styles from "./PasswordStrength.module.scss";
import { Text } from "./Text";

export type PasswordStrengthProps = {
  disabled?: boolean;
  generateLabel: string;
  onGeneratePassword: () => void;
  requirementResults: readonly PasswordStrengthRequirementResult[];
  strength: `medium` | `strong` | `weak`;
  strengthBarWidth: string;
  strengthLabel: string;
  strengthText: string;
};

export type PasswordStrengthRequirementResult = { label: string; met: boolean };

export const PasswordStrength = ({
  disabled = false,
  generateLabel,
  onGeneratePassword,
  requirementResults,
  strength,
  strengthBarWidth,
  strengthLabel,
  strengthText,
}: PasswordStrengthProps) => (
  <>
    <div className={styles.requirements}>
      {requirementResults.map(({ label, met }) => (
        <Text color={met ? `accent` : undefined} key={label} text={`${met ? `✓ ` : ``}${label}`} typography="caption" />
      ))}
    </div>
    <div className={styles.strengthRow}>
      <Text cn={styles.strengthLabel} text={strengthLabel} typography="caption" />
      <div className={styles.strengthBar}>
        <div className={styles.strengthFill} data-strength={strength} style={{ width: strengthBarWidth }} />
      </div>
      <Text cn={styles.strengthText} text={strengthText} typography="caption" />
    </div>
    <Button disabled={disabled} onClick={onGeneratePassword} text={generateLabel} />
  </>
);
