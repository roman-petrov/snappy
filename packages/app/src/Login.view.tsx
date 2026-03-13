import { Button, Input, PasswordInput } from "@snappy/ui";

import type { useLoginState } from "./Login.state";

import { AuthLayout } from "./AuthLayout";
import { FormErrorAndActions } from "./components";
import styles from "./Login.module.scss";

export type LoginViewProps = ReturnType<typeof useLoginState>;

export const LoginView = ({
  email,
  emailLabel,
  error,
  forgotPasswordText,
  hidePasswordLabel,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  password,
  passwordLabel,
  registerLinkText,
  showPasswordLabel,
  submitButtonText,
  title,
}: LoginViewProps) => (
  <AuthLayout title={title}>
    <form className={styles.form} onSubmit={onSubmit}>
      <Input
        autoComplete="email"
        id="login-email"
        label={emailLabel}
        onChange={onEmailChange}
        required
        type="email"
        value={email}
      />
      <PasswordInput
        autoComplete="current-password"
        disabled={loading}
        hidePasswordLabel={hidePasswordLabel}
        id="login-password"
        label={passwordLabel}
        onChange={onPasswordChange}
        required
        showPasswordLabel={showPasswordLabel}
        value={password}
      />
      <FormErrorAndActions error={error}>
        <Button disabled={loading} submit text={submitButtonText} type="primary" />
        <Button text={forgotPasswordText} to="/forgot-password" type="link" />
        <Button text={registerLinkText} to="/register" type="link" />
      </FormErrorAndActions>
    </form>
  </AuthLayout>
);
