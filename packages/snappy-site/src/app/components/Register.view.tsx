import type { useRegisterState } from "./Register.state";

import { AccentLink } from "../../shared/AccentLink";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import { PasswordInput } from "../../shared/PasswordInput";
import { t } from "../core/Locale";
import { passwordMinLength } from "../core/Password";
import { Card } from "./Card";
import styles from "./Login.module.css";

export type RegisterViewProps = ReturnType<typeof useRegisterState>;

export const RegisterView = ({
  email,
  error,
  loading,
  onEmailChange,
  onGeneratePassword,
  onPasswordChange,
  onSubmit,
  password,
  passwordValid,
  requirements,
  strength,
  strengthBarWidth,
  strengthText,
}: RegisterViewProps) => (
  <div className={styles[`authPage`]}>
    <Card className={styles[`authPanel`]} glass narrow>
      <form className={styles[`form`]} onSubmit={onSubmit}>
        <h1 className={styles[`title`]}>{t(`registerPage.title`)}</h1>
        <Input
          autoComplete="email"
          id="reg-email"
          label={t(`registerPage.email`)}
          onChange={onEmailChange}
          required
          type="email"
          value={email}
        />
        <div className={styles[`passwordBlock`]}>
          <PasswordInput
            autoComplete="new-password"
            disabled={loading}
            id="reg-password"
            label={t(`registerPage.password`)}
            minLength={passwordMinLength}
            onChange={onPasswordChange}
            required
            value={password}
          />
          <div className={styles[`requirements`]}>
            {requirements.map(({ check, label }) => (
              <span className={check(password) ? styles[`requirementMet`] : styles[`requirement`]} key={label}>
                {check(password) ? `✓ ` : ``}
                {label}
              </span>
            ))}
          </div>
          <div className={styles[`strengthRow`]}>
            <span className={styles[`strengthLabel`]}>{t(`registerPage.strength`)}:</span>
            <div className={styles[`strengthBar`]}>
              <div
                className={styles[`strengthFill`]}
                data-strength={strength}
                style={{ width: strengthBarWidth }}
              />
            </div>
            <span className={styles[`strengthText`]}>{strengthText}</span>
          </div>
          <Button disabled={loading} onClick={onGeneratePassword} type="button">
            {t(`registerPage.generatePassword`)}
          </Button>
        </div>
        {error !== `` && <p className={styles[`error`]}>{error}</p>}
        <div className={styles[`actions`]}>
          <Button disabled={loading || !passwordValid} primary type="submit">
            {loading ? t(`registerPage.submitting`) : t(`registerPage.submit`)}
          </Button>
          <AccentLink to="/login">{t(`registerPage.haveAccount`)}</AccentLink>
        </div>
      </form>
    </Card>
  </div>
);
