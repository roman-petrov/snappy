import type { useLoginState } from "./Login.state";

import { AccentLink } from "../../shared/AccentLink";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import { Panel } from "../../shared/Panel";
import { PasswordInput } from "../../shared/PasswordInput";
import { t } from "../core/Locale";
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
    <form className={styles[`form`]} onSubmit={onSubmit}>
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
        id="login-password"
        label={t(`loginPage.password`)}
        onChange={onPasswordChange}
        required
        value={password}
      />
      <div className={styles[`rememberRow`]}>
        <input
          checked={remember}
          className={styles[`checkbox`]}
          disabled={loading}
          id="login-remember"
          onChange={e => onRememberChange(e.target.checked)}
          type="checkbox"
        />
        <label className={styles[`rememberLabel`]} htmlFor="login-remember">
          {t(`loginPage.remember`)}
        </label>
      </div>
      {error !== `` && <p className={styles[`error`]}>{error}</p>}
      <div className={styles[`actions`]}>
        <Button disabled={loading} primary type="submit">
          {loading ? t(`loginPage.submitting`) : t(`loginPage.submit`)}
        </Button>
        <AccentLink to="/forgot-password">{t(`loginPage.forgotPassword`)}</AccentLink>
        <AccentLink to="/register">{t(`loginPage.registerLink`)}</AccentLink>
      </div>
    </form>
  </Panel>
);
