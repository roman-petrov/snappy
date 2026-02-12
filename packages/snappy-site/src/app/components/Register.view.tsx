import type { useRegisterState } from "./Register.state";

import { AccentLink } from "../../shared/AccentLink";
import { Button } from "../../shared/Button";
import { Input } from "../../shared/Input";
import { PasswordInput } from "../../shared/PasswordInput";
import { PasswordStrength } from "../../shared/PasswordStrength";
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
    <Card>
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
          <PasswordStrength
            disabled={loading}
            generateLabel={t(`registerPage.generatePassword`)}
            onGeneratePassword={onGeneratePassword}
            password={password}
            requirements={requirements}
            strength={strength}
            strengthBarWidth={strengthBarWidth}
            strengthLabel={`${t(`registerPage.strength`)}:`}
            strengthText={strengthText}
          />
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
