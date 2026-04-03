import { Button, Input, PasswordInput, PasswordStrength } from "@snappy/ui";

import type { useRegisterState } from "./Register.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { AuthForm } from "./AuthForm";
import { FormErrorAndActions } from "./components";
import styles from "./Register.module.scss";

export type RegisterViewProps = ReturnType<typeof useRegisterState>;

export const RegisterView = ({
  email,
  error,
  generatePassword,
  loading,
  minLength,
  password,
  requirementResults,
  setEmail,
  setPassword,
  strength,
  strengthBarWidth,
  submit,
  submitDisabled,
}: RegisterViewProps) => (
  <AuthForm submit={submit} title={t(`registerPage.title`)}>
    <Input
      autoComplete="email"
      label={t(`registerPage.email`)}
      onChange={setEmail}
      required
      type="email"
      value={email}
    />
    <div className={styles.passwordBlock}>
      <PasswordInput
        autoComplete="new-password"
        disabled={loading}
        label={t(`registerPage.password`)}
        minLength={minLength}
        onChange={setPassword}
        required
        value={password}
      />
      <PasswordStrength
        disabled={loading}
        generateLabel={t(`registerPage.generatePassword`)}
        onGeneratePassword={generatePassword}
        requirementResults={requirementResults.map(r => ({
          label: r.params === undefined ? t(r.labelKey) : t(r.labelKey, r.params),
          met: r.met,
        }))}
        strength={strength}
        strengthBarWidth={strengthBarWidth}
        strengthLabel={`${t(`registerPage.strength`)}:`}
        strengthText={
          strength === `weak`
            ? t(`registerPage.strengthWeak`)
            : strength === `medium`
              ? t(`registerPage.strengthMedium`)
              : t(`registerPage.strengthStrong`)
        }
      />
    </div>
    <FormErrorAndActions error={error}>
      <Button
        disabled={submitDisabled}
        submit
        text={loading ? t(`registerPage.submitting`) : t(`registerPage.submit`)}
        type="primary"
      />
      <Button link={Routes.login} text={t(`loginPage.login`)} />
    </FormErrorAndActions>
  </AuthForm>
);
