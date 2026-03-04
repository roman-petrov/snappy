import { Button, Input, Link } from "@snappy/ui";

import type { useForgotPasswordFormState } from "./ForgotPasswordForm.state";

import { t } from "../core";
import styles from "./Form.module.scss";
import { FormErrorAndActions } from "./FormErrorAndActions";

export type ForgotPasswordFormViewProps = ReturnType<typeof useForgotPasswordFormState>;

export const ForgotPasswordFormView = ({
  email,
  error,
  loading,
  onEmailChange,
  onSubmit,
}: ForgotPasswordFormViewProps) => (
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
);
