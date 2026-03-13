import { Button, Input, PasswordInput, PasswordStrength } from "@snappy/ui";

import type { useRegisterState } from "./Register.state";

import { AuthLayout } from "./AuthLayout";
import { FormErrorAndActions } from "./components";
import styles from "./Register.module.scss";

export type RegisterViewProps = ReturnType<typeof useRegisterState>;

export const RegisterView = ({
  email,
  emailLabel,
  error,
  generatePasswordLabel,
  hidePasswordLabel,
  loading,
  loginLinkText,
  minLength,
  onEmailChange,
  onGeneratePassword,
  onPasswordChange,
  onSubmit,
  password,
  passwordLabel,
  requirementResults,
  showPasswordLabel,
  strength,
  strengthBarWidth,
  strengthLabel,
  strengthText,
  submitButtonText,
  submitDisabled,
  title,
}: RegisterViewProps) => (
  <AuthLayout title={title}>
    <form className={styles.form} onSubmit={onSubmit}>
      <Input
        autoComplete="email"
        id="reg-email"
        label={emailLabel}
        onChange={onEmailChange}
        required
        type="email"
        value={email}
      />
      <div className={styles.passwordBlock}>
        <PasswordInput
          autoComplete="new-password"
          disabled={loading}
          hidePasswordLabel={hidePasswordLabel}
          id="reg-password"
          label={passwordLabel}
          minLength={minLength}
          onChange={onPasswordChange}
          required
          showPasswordLabel={showPasswordLabel}
          value={password}
        />
        <PasswordStrength
          disabled={loading}
          generateLabel={generatePasswordLabel}
          onGeneratePassword={onGeneratePassword}
          requirementResults={requirementResults}
          strength={strength}
          strengthBarWidth={strengthBarWidth}
          strengthLabel={strengthLabel}
          strengthText={strengthText}
        />
      </div>
      <FormErrorAndActions error={error}>
        <Button disabled={submitDisabled} submit text={submitButtonText} type="primary" />
        <Button text={loginLinkText} to="/login" type="link" />
      </FormErrorAndActions>
    </form>
  </AuthLayout>
);
