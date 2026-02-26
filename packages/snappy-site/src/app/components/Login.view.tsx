import { Button, Input, Link, Panel, PasswordInput, Text } from "@snappy/ui";

import type { useLoginState } from "./Login.state";

import { t } from "../core";
import { FormErrorAndActions } from "./FormErrorAndActions";
import styles from "./Login.module.css";

export type LoginViewProps = ReturnType<typeof useLoginState>;

export const LoginView = ({
  email,
  error,
  loading,
  onEmailChange,
  onPasswordChange,
  onRememberChange,
  onSubmit,
  password,
  remember,
}: LoginViewProps) => (
  <Panel title={t(`loginPage.title`)}>
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
        <Button disabled={loading} primary type="submit">
          {loading ? t(`loginPage.submitting`) : t(`loginPage.submit`)}
        </Button>
        <Link text={t(`loginPage.forgotPassword`)} to="/forgot-password" />
        <Link text={t(`loginPage.registerLink`)} to="/register" />
      </FormErrorAndActions>
    </form>
  </Panel>
);
