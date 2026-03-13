/* jscpd:ignore-start */
import { Button, PasswordInput } from "@snappy/ui";

import type { useResetPasswordState } from "./ResetPassword.state";

import { AuthLayout } from "./AuthLayout";
import { FormErrorAndActions, MessageWithLink } from "./components";
import styles from "./ResetPassword.module.scss";

export type ResetPasswordViewProps = ReturnType<typeof useResetPasswordState>;

export const ResetPasswordView = ({
  error,
  hidePasswordLabel,
  loading,
  messageLead,
  messageLinkText,
  messageLinkTo,
  messageTitle,
  minLength,
  onPasswordChange,
  onSubmit,
  password,
  passwordLabel,
  screen,
  showPasswordLabel,
  submitButtonText,
  title,
}: ResetPasswordViewProps) => {
  if (
    screen !== `form` &&
    messageLead !== undefined &&
    messageLinkText !== undefined &&
    messageLinkTo !== undefined &&
    messageTitle !== undefined
  ) {
    return (
      <AuthLayout title={title}>
        <MessageWithLink lead={messageLead} linkText={messageLinkText} linkTo={messageLinkTo} title={messageTitle} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={title}>
      <form className={styles.form} onSubmit={onSubmit}>
        <PasswordInput
          autoComplete="new-password"
          disabled={loading}
          hidePasswordLabel={hidePasswordLabel}
          id="reset-password"
          label={passwordLabel}
          minLength={minLength}
          onChange={onPasswordChange}
          required
          showPasswordLabel={showPasswordLabel}
          value={password}
        />
        <FormErrorAndActions error={error}>
          <Button disabled={loading} submit text={submitButtonText} type="primary" />
        </FormErrorAndActions>
      </form>
    </AuthLayout>
  );
};
/* jscpd:ignore-end */
