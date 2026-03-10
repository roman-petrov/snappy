import { Button, Input, PasswordInput, Text } from "@snappy/ui";

import type { useLoginFormState } from "./LoginForm.state";

import { t } from "../core";
import { FormErrorAndActions } from "./FormErrorAndActions";
import styles from "./LoginForm.module.scss";

export type LoginFormViewProps = ReturnType<typeof useLoginFormState>;

export const LoginFormView = ({
  email,
  error,
  loading,
  onEmailChange,
  onPasswordChange,
  onRememberChange,
  onSubmit,
  password,
  remember,
}: LoginFormViewProps) => (
  <form className={styles.form} onSubmit={onSubmit}>
    <Input
      autoComplete="email"
      id="login-email"
      label={t(`loginPage.email`)}
      onChange={onEmailChange}
      required
      type="email"
      value={email}
    />
    <PasswordInput
      autoComplete="current-password"
      disabled={loading}
      hidePasswordLabel={t(`passwordInput.hidePassword`)}
      id="login-password"
      label={t(`loginPage.password`)}
      onChange={onPasswordChange}
      required
      showPasswordLabel={t(`passwordInput.showPassword`)}
      value={password}
    />
    <div className={styles.rememberRow}>
      <input
        checked={remember}
        className={styles.checkbox}
        disabled={loading}
        id="login-remember"
        onChange={event => onRememberChange((event.target as HTMLInputElement).checked)}
        type="checkbox"
      />
      <Text
        as="label"
        cn={styles.rememberLabel}
        htmlFor="login-remember"
        text={t(`loginPage.remember`)}
        typography="caption"
      />
    </div>
    <FormErrorAndActions error={error}>
      <Button
        disabled={loading}
        submit
        text={loading ? t(`loginPage.submitting`) : t(`loginPage.submit`)}
        type="primary"
      />
      <Button text={t(`loginPage.forgotPassword`)} to="/forgot-password" type="link" />
      <Button text={t(`loginPage.registerLink`)} to="/register" type="link" />
    </FormErrorAndActions>
  </form>
);
