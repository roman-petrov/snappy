import { Button, Input, Link, Panel } from "@snappy/ui";

import type { useForgotPasswordState } from "./ForgotPassword.state";

import { t } from "../core";
import { FormErrorAndActions } from "./FormErrorAndActions";
import styles from "./Login.module.scss";
import { PanelWithLink } from "./PanelWithLink";

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
      <PanelWithLink
        lead={t(`forgotPage.checkEmailLead`)}
        linkText={t(`forgotPage.backToLogin`)}
        linkTo="/login"
        title={t(`forgotPage.checkEmail`)}
      />
    );
  }

  return (
    <Panel lead={t(`forgotPage.lead`)} title={t(`forgotPage.title`)}>
      <form className={styles.form} onSubmit={onSubmit}>
        <Input
          autoComplete="email"
          id="forgot-email"
          label={t(`forgotPage.email`)}
          onChange={onEmailChange}
          required
          type="email"
          value={email}
        />
        <FormErrorAndActions error={error}>
          <Button disabled={loading} primary type="submit">
            {loading ? t(`forgotPage.submitting`) : t(`forgotPage.submit`)}
          </Button>
          <Link text={t(`forgotPage.loginLink`)} to="/login" />
        </FormErrorAndActions>
      </form>
    </Panel>
  );
};
