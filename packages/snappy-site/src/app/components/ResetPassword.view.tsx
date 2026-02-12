import type { useResetPasswordState } from "./ResetPassword.state";

import { AccentLink } from "../../shared/AccentLink";
import { Button } from "../../shared/Button";
import { PasswordInput } from "../../shared/PasswordInput";
import { t } from "../core/Locale";
import { passwordMinLength } from "../core/Password";
import { Card } from "./Card";
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
      <div className={styles[`authPage`]}>
        <Card>
          <h1 className={styles[`title`]}>{t(`resetPage.invalidLink`)}</h1>
          <p className={styles[`authLead`]}>{t(`resetPage.invalidLinkLead`)}</p>
          <div className={styles[`actions`]}>
            <AccentLink to="/forgot-password">{t(`resetPage.requestAgain`)}</AccentLink>
          </div>
        </Card>
      </div>
    );
  }

  if (done) {
    return (
      <div className={styles[`authPage`]}>
        <Card>
          <h1 className={styles[`title`]}>{t(`resetPage.done`)}</h1>
          <p className={styles[`authLead`]}>{t(`resetPage.doneLead`)}</p>
          <div className={styles[`actions`]}>
            <AccentLink to="/login">{t(`resetPage.loginLink`)}</AccentLink>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles[`authPage`]}>
      <Card>
        <form className={styles[`form`]} onSubmit={onSubmit}>
          <h1 className={styles[`title`]}>{t(`resetPage.title`)}</h1>
          <PasswordInput
            autoComplete="new-password"
            disabled={loading}
            id="reset-password"
            label={t(`resetPage.passwordLabel`, { min: passwordMinLength })}
            minLength={passwordMinLength}
            onChange={onPasswordChange}
            required
            value={password}
          />
          {error !== `` && <p className={styles[`error`]}>{error}</p>}
          <div className={styles[`actions`]}>
            <Button disabled={loading} primary type="submit">
              {loading ? t(`resetPage.submitting`) : t(`resetPage.submit`)}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
