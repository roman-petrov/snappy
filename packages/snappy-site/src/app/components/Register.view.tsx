import { Button, Input, Link, Panel, PasswordInput, PasswordStrength } from "@snappy/ui";

import type { useRegisterState } from "./Register.state";

import { Password, t } from "../core";
import { FormErrorAndActions } from "./FormErrorAndActions";
import styles from "./Login.module.css";

export type RegisterViewProps = ReturnType<typeof useRegisterState>;

export const RegisterView = ({
  email,
  error,
  loading,
  meetsMinLength,
  onEmailChange,
  onGeneratePassword,
  onPasswordChange,
  onSubmit,
  password,
  requirements,
  strength,
  strengthBarWidth,
  strengthText,
}: RegisterViewProps) => (
  <Panel title={t(`registerPage.title`)}>
    <form className={styles.form} onSubmit={onSubmit}>
      <Input
        autoComplete="email"
        id="reg-email"
        label={t(`registerPage.email`)}
        onChange={onEmailChange}
        required
        type="email"
        value={email}
      />
      <div className={styles.passwordBlock}>
        <PasswordInput
          autoComplete="new-password"
          disabled={loading}
          hidePasswordLabel={t(`passwordInput.hidePassword`)}
          id="reg-password"
          label={t(`registerPage.password`)}
          minLength={Password.minLength}
          onChange={onPasswordChange}
          required
          showPasswordLabel={t(`passwordInput.showPassword`)}
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
      <FormErrorAndActions error={error}>
        <Button disabled={loading || !meetsMinLength} primary type="submit">
          {loading ? t(`registerPage.submitting`) : t(`registerPage.submit`)}
        </Button>
        <Link text={t(`registerPage.haveAccount`)} to="/login" />
      </FormErrorAndActions>
    </form>
  </Panel>
);
