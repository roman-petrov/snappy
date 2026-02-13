import type { useResetPasswordState } from "./ResetPassword.state";

import { Button, Link, Panel, PasswordInput } from "@snappy/ui";
import { t } from "../core/Locale";
import { passwordMinLength } from "../core/Password";
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
        <div className={styles[`actions`]}>
          <Link to="/forgot-password">{t(`resetPage.requestAgain`)}</Link>
        </div>
      </Panel>
    );
  }

  if (done) {
    return (
      <Panel lead={t(`resetPage.doneLead`)} title={t(`resetPage.done`)}>
        <div className={styles[`actions`]}>
          <Link to="/login">{t(`resetPage.loginLink`)}</Link>
        </div>
      </Panel>
    );
  }

  return (
    <Panel title={t(`resetPage.title`)}>
      <form className={styles[`form`]} onSubmit={onSubmit}>
        <PasswordInput
          autoComplete="new-password"
          disabled={loading}
          hidePasswordLabel={t(`passwordInput.hidePassword`)}
          id="reset-password"
          label={t(`resetPage.passwordLabel`, { min: passwordMinLength })}
          minLength={passwordMinLength}
          onChange={onPasswordChange}
          required
          showPasswordLabel={t(`passwordInput.showPassword`)}
          value={password}
        />
        {error !== `` && <p className={styles[`error`]}>{error}</p>}
        <div className={styles[`actions`]}>
          <Button disabled={loading} primary type="submit">
            {loading ? t(`resetPage.submitting`) : t(`resetPage.submit`)}
          </Button>
        </div>
      </form>
    </Panel>
  );
};
