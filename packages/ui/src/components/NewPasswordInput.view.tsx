import { _ } from "@snappy/core";
import { Dices, Eye, EyeOff } from "lucide-react";

import type { useNewPasswordInputState } from "./NewPasswordInput.state";

import { t } from "../locales";
import { IconButton } from "./IconButton";
import { Input } from "./Input";
import styles from "./NewPasswordInput.module.scss";

export type NewPasswordInputViewProps = ReturnType<typeof useNewPasswordInputState>;

export const NewPasswordInputView = ({
  generatePassword,
  strength,
  strengthBarWidth,
  toggleVisible,
  value,
  visible,
  ...inputProps
}: NewPasswordInputViewProps) => (
  <Input
    {...inputProps}
    overlay={
      value.length === 0 ? undefined : (
        <div className={styles.strengthTrack}>
          <div
            className={_.cn(
              styles.strengthFill,
              strength === `weak` ? styles.weak : strength === `medium` ? styles.medium : styles.strong,
            )}
            style={{ width: strengthBarWidth }}
          />
        </div>
      )
    }
    suffix={
      value.length === 0 ? (
        <IconButton
          disabled={inputProps.disabled}
          icon={Dices}
          onClick={generatePassword}
          tip={t(`newPasswordInput.generatePassword`)}
        />
      ) : (
        <IconButton
          disabled={inputProps.disabled}
          icon={visible ? EyeOff : Eye}
          onClick={toggleVisible}
          tip={visible ? t(`passwordInput.hidePassword`) : t(`passwordInput.showPassword`)}
        />
      )
    }
    type={visible ? `text` : `password`}
    value={value}
  />
);
