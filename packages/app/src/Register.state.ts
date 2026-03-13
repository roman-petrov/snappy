import type { SyntheticEvent } from "react";

import { useSignalState } from "@snappy/ui";

import { api, Password, t } from "./core";
import { useAsyncSubmit, useRunAfterAuth } from "./hooks";

export const useRegisterState = () => {
  const [email, setEmail] = useSignalState(``);
  const [password, setPassword] = useSignalState(``);
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit();
  const runAfterAuth = useRunAfterAuth(wrapSubmit, setError, t, `registerPage`);
  const strengthValue = Password.strength(password);

  const requirements = [
    {
      check: Password.requirementChecks[0]?.check ?? (() => false),
      label: t(`registerPage.requirementMin`, { min: Password.minLength }),
    },
    { check: Password.requirementChecks[1]?.check ?? (() => false), label: t(`registerPage.requirementLetters`) },
  ];

  const requirementResults = requirements.map(r => ({ label: r.label, met: r.check(password) }));

  const strengthBarWidth =
    password.length === 0 ? `0%` : strengthValue === `weak` ? `33%` : strengthValue === `medium` ? `66%` : `100%`;

  const strengthText =
    strengthValue === `weak`
      ? t(`registerPage.strengthWeak`)
      : strengthValue === `medium`
        ? t(`registerPage.strengthMedium`)
        : t(`registerPage.strengthStrong`);

  const meetsMinLength = password.length >= Password.minLength;

  const onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!meetsMinLength) {
      setError(t(`registerPage.passwordRule`, { min: Password.minLength }));

      return;
    }
    runAfterAuth(async () => api.register(email.trim(), password));
  };

  const onGeneratePassword = () => setPassword(Password.generate());

  return {
    email,
    emailLabel: t(`registerPage.email`),
    error,
    generatePasswordLabel: t(`registerPage.generatePassword`),
    hidePasswordLabel: t(`passwordInput.hidePassword`),
    loading,
    loginLinkText: t(`loginPage.login`),
    minLength: Password.minLength,
    onEmailChange: setEmail,
    onGeneratePassword,
    onPasswordChange: setPassword,
    onSubmit,
    password,
    passwordLabel: t(`registerPage.password`),
    requirementResults,
    showPasswordLabel: t(`passwordInput.showPassword`),
    strength: strengthValue,
    strengthBarWidth,
    strengthLabel: `${t(`registerPage.strength`)}:`,
    strengthText,
    submitButtonText: loading ? t(`registerPage.submitting`) : t(`registerPage.submit`),
    submitDisabled: loading || !meetsMinLength,
    title: t(`registerPage.title`),
  };
};
