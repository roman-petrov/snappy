import type { useForgotPasswordState } from "./ForgotPassword.state";

import { AccentLink } from "../../shared/AccentLink";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import { t } from "../core/Locale";
import { Card } from "./Card";
import styles from "./Login.module.css";

export type ForgotPasswordViewProps = ReturnType<typeof useForgotPasswordState>;

export const ForgotPasswordView = ({
  email,
  error,
  loading,
  onEmailChange,
  onSubmit,
  sent,
}: ForgotPasswordViewProps) => {
  if (sent) {
    return (
      <div className={styles[`authPage`]}>
        <Card className={styles[`authPanel`]} glass narrow>
          <h1 className={styles[`title`]}>{t(`forgotPage.checkEmail`)}</h1>
          <p className={styles[`authLead`]}>{t(`forgotPage.checkEmailLead`)}</p>
          <div className={styles[`actions`]}>
            <AccentLink to="/login">{t(`forgotPage.backToLogin`)}</AccentLink>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles[`authPage`]}>
      <Card className={styles[`authPanel`]} glass narrow>
        <form className={styles[`form`]} onSubmit={onSubmit}>
          <h1 className={styles[`title`]}>{t(`forgotPage.title`)}</h1>
          <p className={styles[`authLead`]}>{t(`forgotPage.lead`)}</p>
          <Input
            autoComplete="email"
            id="forgot-email"
            label={t(`forgotPage.email`)}
            onChange={onEmailChange}
            required
            type="email"
            value={email}
          />
          {error !== `` && <p className={styles[`error`]}>{error}</p>}
          <div className={styles[`actions`]}>
            <Button disabled={loading} primary type="submit">
              {loading ? t(`forgotPage.submitting`) : t(`forgotPage.submit`)}
            </Button>
            <AccentLink to="/login">{t(`forgotPage.loginLink`)}</AccentLink>
          </div>
        </form>
      </Card>
    </div>
  );
};
