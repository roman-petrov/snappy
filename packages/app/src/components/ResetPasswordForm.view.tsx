/* jscpd:ignore-start */
import { Button, PasswordInput } from "@snappy/ui";

import type { useResetPasswordFormState } from "./ResetPasswordForm.state";

import { Password, t } from "../core";
import styles from "./Form.module.scss";
import { FormErrorAndActions } from "./FormErrorAndActions";
import { MessageWithLink } from "./MessageWithLink";

export type ResetPasswordFormViewProps = ReturnType<typeof useResetPasswordFormState>;

export const ResetPasswordFormView = ({ formProps, messageProps, screen }: ResetPasswordFormViewProps) => {
  if (messageProps !== undefined) {
    return <MessageWithLink {...messageProps} />;
  }

  if (screen === `form` && formProps !== undefined) {
    return (
      <form className={styles.form} onSubmit={formProps.onSubmit}>
        <PasswordInput
          autoComplete="new-password"
          disabled={formProps.loading}
          hidePasswordLabel={t(`passwordInput.hidePassword`)}
          id="reset-password"
          label={t(`resetPage.passwordLabel`, { min: Password.minLength })}
          minLength={Password.minLength}
          onChange={formProps.onPasswordChange}
          required
          showPasswordLabel={t(`passwordInput.showPassword`)}
          value={formProps.password}
        />
        <FormErrorAndActions error={formProps.error}>
          <Button disabled={formProps.loading} primary type="submit">
            {formProps.loading ? t(`resetPage.submitting`) : t(`resetPage.submit`)}
          </Button>
        </FormErrorAndActions>
      </form>
    );
  }

  return undefined;
};
/* jscpd:ignore-end */
