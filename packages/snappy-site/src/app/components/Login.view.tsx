import { Button, Input, Link, Panel, PasswordInput } from "@snappy/ui";

import type { useLoginState } from "./Login.state";

import { css } from "../../../styled-system/css";
import { flex } from "../../../styled-system/patterns";
import { t } from "../core";
import { form } from "./AuthForm.styles";
import { FormErrorAndActions } from "./FormErrorAndActions";

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
  <Panel title={t("loginPage.title")}>
    <form className={form} onSubmit={onSubmit}>
      <Input
        autoComplete="email"
        id="login-email"
        label={t("loginPage.email")}
        onChange={onEmailChange}
        required
        type="email"
        value={email}
      />
      <PasswordInput
        autoComplete="current-password"
        disabled={loading}
        hidePasswordLabel={t("passwordInput.hidePassword")}
        id="login-password"
        label={t("loginPage.password")}
        onChange={onPasswordChange}
        required
        showPasswordLabel={t("passwordInput.showPassword")}
        value={password}
      />
      <div className={flex({ alignItems: "center", gap: "0.5rem", marginBottom: "1rem" })}>
        <input
          checked={remember}
          className={css({ accentColor: "accent", cursor: "pointer", height: "1.125rem", width: "1.125rem" })}
          disabled={loading}
          id="login-remember"
          onChange={event => onRememberChange((event.target as HTMLInputElement).checked)}
          type="checkbox"
        />
        <label className={css({ color: "text.body", cursor: "pointer", fontSize: "sm" })} htmlFor="login-remember">
          {t("loginPage.remember")}
        </label>
      </div>
      <FormErrorAndActions error={error}>
        <Button disabled={loading} primary type="submit">
          {loading ? t("loginPage.submitting") : t("loginPage.submit")}
        </Button>
        <Link to="/forgot-password">{t("loginPage.forgotPassword")}</Link>
        <Link to="/register">{t("loginPage.registerLink")}</Link>
      </FormErrorAndActions>
    </form>
  </Panel>
);
