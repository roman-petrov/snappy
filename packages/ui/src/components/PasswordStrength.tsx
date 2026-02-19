import { css, cva } from "../../styled-system/css";
import { Button } from "./Button";

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
  requirements: reqs,
  strength,
  strengthBarWidth,
  strengthLabel: strengthLabelText,
  strengthText: strengthTextValue,
}: PasswordStrengthProps) => (
  <>
    <div
      className={css({
        color: `text.muted`,
        display: `flex`,
        flexDirection: `column`,
        fontSize: `xs`,
        gap: `1`,
        marginBottom: `3`,
        marginTop: `2`,
      })}
    >
      {reqs.map(({ check, label }) => (
        <span className={check(password) ? css({ color: `accent` }) : css({ color: `text.muted` })} key={label}>
          {check(password) ? `✓ ` : ``}
          {label}
        </span>
      ))}
    </div>
    <div className={css({ alignItems: `center`, display: `flex`, gap: `2`, marginBottom: `3` })}>
      <span className={css({ color: `text.muted`, fontSize: `sm`, whiteSpace: `nowrap` })}>{strengthLabelText}</span>
      <div className={css({ bg: "border", borderRadius: "xs", flex: "1", height: "strengthBar", overflow: "hidden" })}>
        <div
          className={cva({
            base: {
              borderRadius: "xs",
              height: "full",
              transitionDuration: "fast",
              transitionProperty: "width",
              transitionTimingFunction: "default",
            },
            defaultVariants: { strength: `weak` },
            variants: {
              strength: {
                medium: { bg: `status.warning` },
                strong: { bg: `status.success` },
                weak: { bg: `accentRed` },
              },
            },
          })({ strength })}
          style={{ width: strengthBarWidth }}
        />
      </div>
      <span className={css({ color: `text.muted`, fontSize: `sm`, minWidth: `minText` })}>{strengthTextValue}</span>
    </div>
    <Button disabled={disabled} onClick={onGeneratePassword} type="button">
      {generateLabel}
    </Button>
  </>
);
