import { Button, Input, PasswordInput, PasswordStrength } from "@snappy/ui";

import type { useRegisterState } from "./Register.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { AuthForm, FormErrorAndActions } from "./components";
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
  <AuthForm submit={submit} title={t(`auth.register.title`)}>
    <Input
      autoComplete="email"
      label={t(`auth.register.email`)}
      onChange={setEmail}
      required
      type="email"
      value={email}
    />
    <div className={styles.passwordBlock}>
      <PasswordInput
        autoComplete="new-password"
        disabled={loading}
        label={t(`auth.register.password`)}
        minLength={minLength}
        onChange={setPassword}
        required
        value={password}
      />
      <PasswordStrength
        disabled={loading}
        generateLabel={t(`auth.register.generatePassword`)}
        onGeneratePassword={generatePassword}
        requirementResults={requirementResults.map(r => ({
          label: r.params === undefined ? t(r.labelKey) : t(r.labelKey, r.params),
          met: r.met,
        }))}
        strength={strength}
        strengthBarWidth={strengthBarWidth}
        strengthLabel={`${t(`auth.register.strength`)}:`}
        strengthText={
          strength === `weak`
            ? t(`auth.register.strengthWeak`)
            : strength === `medium`
              ? t(`auth.register.strengthMedium`)
              : t(`auth.register.strengthStrong`)
        }
      />
    </div>
    <FormErrorAndActions error={error === undefined ? `` : t(error.key, error.params)}>
      <Button
        disabled={submitDisabled}
        submit
        text={loading ? t(`auth.register.submitting`) : t(`auth.register.submit`)}
        type="primary"
      />
      <Button link={Routes.login} text={t(`auth.login.title`)} />
    </FormErrorAndActions>
  </AuthForm>
);
