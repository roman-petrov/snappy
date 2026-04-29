import { _ } from "@snappy/core";

import { $, type Surface } from "../$";
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

const strengthSurface: Record<PasswordStrengthProps[`strength`], Surface> = {
  medium: `warning`,
  strong: `success`,
  weak: `error`,
};

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
        <Text
          color={met ? `primary` : undefined}
          key={label}
          text={`${met ? `✓ ` : ``}${label}`}
          typography="caption"
        />
      ))}
    </div>
    <div className={styles.strengthRow}>
      <Text cn={styles.strengthLabel} text={strengthLabel} typography="caption" />
      <div className={_.cn(styles.strengthBar, $.surface(`surface`), $.elevation(`e1`), $.radius(`xs`))}>
        <div
          className={_.cn(styles.strengthFill, $.surface(strengthSurface[strength]), $.elevation(`e1`), $.radius(`xs`))}
          style={{ width: strengthBarWidth }}
        />
      </div>
      <Text cn={styles.strengthText} text={strengthText} typography="caption" />
    </div>
    <Button disabled={disabled} onClick={onGeneratePassword} text={generateLabel} />
  </>
);
