import type { useForgotPasswordState } from "./ForgotPassword.state";

import { Link } from "../../shared/Link";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import { Panel } from "../../shared/Panel";
import { t } from "../core/Locale";
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
      <Panel lead={t(`forgotPage.checkEmailLead`)} title={t(`forgotPage.checkEmail`)}>
        <div className={styles[`actions`]}>
          <Link to="/login">{t(`forgotPage.backToLogin`)}</Link>
        </div>
      </Panel>
    );
  }

  return (
    <Panel lead={t(`forgotPage.lead`)} title={t(`forgotPage.title`)}>
      <form className={styles[`form`]} onSubmit={onSubmit}>
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
          <Link to="/login">{t(`forgotPage.loginLink`)}</Link>
        </div>
      </form>
    </Panel>
  );
};
