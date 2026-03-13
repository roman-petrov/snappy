/* jscpd:ignore-start */
import { Button, Input } from "@snappy/ui";

import type { useForgotPasswordState } from "./ForgotPassword.state";

import { AuthLayout } from "./AuthLayout";
import { FormErrorAndActions, MessageWithLink } from "./components";
import styles from "./ForgotPassword.module.scss";

export type ForgotPasswordViewProps = ReturnType<typeof useForgotPasswordState>;

export const ForgotPasswordView = ({
  email,
  emailLabel,
  error,
  lead,
  loading,
  loginLinkText,
  messageLead,
  messageLinkText,
  messageLinkTo,
  messageTitle,
  onEmailChange,
  onSubmit,
  screen,
  submitButtonText,
  title,
}: ForgotPasswordViewProps) => {
  if (
    screen === `sent` &&
    messageLead !== undefined &&
    messageLinkText !== undefined &&
    messageLinkTo !== undefined &&
    messageTitle !== undefined
  ) {
    return (
      <AuthLayout lead={lead} title={title}>
        <MessageWithLink lead={messageLead} linkText={messageLinkText} linkTo={messageLinkTo} title={messageTitle} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout lead={lead} title={title}>
      <form className={styles.form} onSubmit={onSubmit}>
        <Input
          autoComplete="email"
          id="forgot-email"
          label={emailLabel}
          onChange={onEmailChange}
          required
          type="email"
          value={email}
        />
        <FormErrorAndActions error={error}>
          <Button disabled={loading} submit text={submitButtonText} type="primary" />
          <Button text={loginLinkText} to="/login" type="link" />
        </FormErrorAndActions>
      </form>
    </AuthLayout>
  );
};
/* jscpd:ignore-end */
