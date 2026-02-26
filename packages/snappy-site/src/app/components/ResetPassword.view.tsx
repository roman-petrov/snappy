import { Button, Link, Panel, PasswordInput } from "@snappy/ui";

import type { useResetPasswordState } from "./ResetPassword.state";

import { Password, t } from "../core";
import { FormActions, FormErrorAndActions } from "./FormErrorAndActions";
import styles from "./Login.module.css";

export type ResetPasswordViewProps = ReturnType<typeof useResetPasswordState>;

export const ResetPasswordView = ({
  done,
  error,
  loading,
  onPasswordChange,
  onSubmit,
  password,
  token,
}: ResetPasswordViewProps) => {
  if (token === ``) {
    return (
      <Panel lead={t(`resetPage.invalidLinkLead`)} title={t(`resetPage.invalidLink`)}>
        <FormActions>
          <Link text={t(`resetPage.requestAgain`)} to="/forgot-password" />
        </FormActions>
      </Panel>
    );
  }

  if (done) {
    return (
      <Panel lead={t(`resetPage.doneLead`)} title={t(`resetPage.done`)}>
        <FormActions>
          <Link text={t(`resetPage.loginLink`)} to="/login" />
        </FormActions>
      </Panel>
    );
  }

  return (
    <Panel title={t(`resetPage.title`)}>
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
    </Panel>
  );
};
