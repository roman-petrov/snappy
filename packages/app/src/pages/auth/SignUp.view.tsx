import { Button, Input, PasswordInput, PasswordStrength } from "@snappy/ui";

import type { useSignUpState } from "./SignUp.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { AuthForm, FormErrorAndActions } from "./components";
import styles from "./SignUp.module.scss";

export type SignUpViewProps = ReturnType<typeof useSignUpState>;

export const SignUpView = ({
  email,
  error,
  generatePassword,
  loading,
  minLength,
  password,
  requirements,
  setEmail,
  setPassword,
  strength,
  strengthBarWidth,
  submit,
  submitDisabled,
}: SignUpViewProps) => (
  <AuthForm submit={submit} title={t(`auth.signUp.title`)}>
    <Input
      autoComplete="email"
      label={t(`auth.signUp.email`)}
      onChange={setEmail}
      required
      type="email"
      value={email}
    />
    <div className={styles.passwordBlock}>
      <PasswordInput
        autoComplete="new-password"
        disabled={loading}
        label={t(`auth.signUp.password`)}
        minLength={minLength}
        onChange={setPassword}
        required
        value={password}
      />
      <PasswordStrength
        disabled={loading}
        generateLabel={t(`auth.signUp.generatePassword`)}
        onGeneratePassword={generatePassword}
        requirementResults={[
          { label: t(`auth.signUp.requirementMin`, { min: minLength }), met: requirements.minLength },
          { label: t(`auth.signUp.requirementLetters`), met: requirements.letters },
        ]}
        strength={strength}
        strengthBarWidth={strengthBarWidth}
        strengthLabel={`${t(`auth.signUp.strength`)}:`}
        strengthText={
          strength === `weak`
            ? t(`auth.signUp.strengthWeak`)
            : strength === `medium`
              ? t(`auth.signUp.strengthMedium`)
              : t(`auth.signUp.strengthStrong`)
        }
      />
    </div>
    <FormErrorAndActions
      error={
        error === undefined
          ? ``
          : error === `passwordRule`
            ? t(`auth.signUp.passwordRule`, { min: minLength })
            : t(`auth.signUp.errors.${error}`)
      }
    >
      <Button
        disabled={submitDisabled}
        submit
        text={loading ? t(`auth.signUp.submitting`) : t(`auth.signUp.submit`)}
        type="primary"
      />
      <Button link={Routes.signIn} text={t(`auth.signIn.title`)} />
    </FormErrorAndActions>
  </AuthForm>
);
