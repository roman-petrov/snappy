import { Button, Input, PasswordInput, PasswordStrength } from "@snappy/ui";

import type { useRegisterFormState } from "./RegisterForm.state";

import { Password, t } from "../core";
import styles from "./Form.module.scss";
import { FormErrorAndActions } from "./FormErrorAndActions";

export type RegisterFormViewProps = ReturnType<typeof useRegisterFormState>;

export const RegisterFormView = ({
  email,
  error,
  loading,
  meetsMinLength,
  onEmailChange,
  onGeneratePassword,
  onPasswordChange,
  onSubmit,
  password,
  requirementResults,
  strength,
  strengthBarWidth,
  strengthText,
}: RegisterFormViewProps) => (
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
        requirementResults={requirementResults}
        strength={strength}
        strengthBarWidth={strengthBarWidth}
        strengthLabel={`${t(`registerPage.strength`)}:`}
        strengthText={strengthText}
      />
    </div>
    <FormErrorAndActions error={error}>
      <Button
        disabled={loading || !meetsMinLength}
        submit
        text={loading ? t(`registerPage.submitting`) : t(`registerPage.submit`)}
        type="primary"
      />
      <Button text={t(`registerPage.haveAccount`)} to="/login" type="link" />
    </FormErrorAndActions>
  </form>
);
