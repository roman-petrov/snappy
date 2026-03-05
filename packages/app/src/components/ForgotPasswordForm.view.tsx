/* jscpd:ignore-start */
import { Button, Input, Link } from "@snappy/ui";

import type { useForgotPasswordFormState } from "./ForgotPasswordForm.state";

import { t } from "../core";
import styles from "./Form.module.scss";
import { FormErrorAndActions } from "./FormErrorAndActions";
import { MessageWithLink } from "./MessageWithLink";

export type ForgotPasswordFormViewProps = ReturnType<typeof useForgotPasswordFormState>;

export const ForgotPasswordFormView = ({ formProps, messageProps, screen }: ForgotPasswordFormViewProps) => {
  if (messageProps !== undefined) {
    return <MessageWithLink {...messageProps} />;
  }

  if (screen === `form` && formProps !== undefined) {
    return (
      <form className={styles.form} onSubmit={formProps.onSubmit}>
        <Input
          autoComplete="email"
          id="forgot-email"
          label={t(`forgotPage.email`)}
          onChange={formProps.onEmailChange}
          required
          type="email"
          value={formProps.email}
        />
        <FormErrorAndActions error={formProps.error}>
          <Button disabled={formProps.loading} primary type="submit">
            {formProps.loading ? t(`forgotPage.submitting`) : t(`forgotPage.submit`)}
          </Button>
          <Link text={t(`forgotPage.loginLink`)} to="/login" />
        </FormErrorAndActions>
      </form>
    );
  }

  return undefined;
};
/* jscpd:ignore-end */
