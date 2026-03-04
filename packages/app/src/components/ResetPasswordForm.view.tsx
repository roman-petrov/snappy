import { Button, PasswordInput } from "@snappy/ui";

import type { useResetPasswordFormState } from "./ResetPasswordForm.state";

import { Password, t } from "../core";
import styles from "./Form.module.scss";
import { FormErrorAndActions } from "./FormErrorAndActions";

export type ResetPasswordFormViewProps = ReturnType<typeof useResetPasswordFormState>;

export const ResetPasswordFormView = ({
  error,
  loading,
  onPasswordChange,
  onSubmit,
  password,
}: ResetPasswordFormViewProps) => (
  <form className={styles.form} onSubmit={onSubmit}>
    <PasswordInput
      autoComplete="new-password"
      disabled={loading}
      hidePasswordLabel={t(`passwordInput.hidePassword`)}
      id="reset-password"
      label={t(`resetPage.passwordLabel`, { min: Password.minLength })}
      minLength={Password.minLength}
      onChange={onPasswordChange}
      required
      showPasswordLabel={t(`passwordInput.showPassword`)}
      value={password}
    />
    <FormErrorAndActions error={error}>
      <Button disabled={loading} primary type="submit">
        {loading ? t(`resetPage.submitting`) : t(`resetPage.submit`)}
      </Button>
    </FormErrorAndActions>
  </form>
);
