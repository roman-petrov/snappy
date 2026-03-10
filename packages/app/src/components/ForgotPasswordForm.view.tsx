/* jscpd:ignore-start */
import { Button, Input } from "@snappy/ui";

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
          <Button
            disabled={formProps.loading}
            submit
            text={formProps.loading ? t(`forgotPage.submitting`) : t(`forgotPage.submit`)}
            type="primary"
          />
          <Button text={t(`loginPage.login`)} to="/login" type="link" />
        </FormErrorAndActions>
      </form>
    );
  }

  return undefined;
};
/* jscpd:ignore-end */
