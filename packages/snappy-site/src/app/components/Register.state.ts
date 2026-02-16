import { type SyntheticEvent, useState } from "react";

import { api, Password, t } from "../core";
import { useAsyncSubmit, useRunAfterAuth } from "../hooks";

export const useRegisterState = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit({ errorKey: `registerPage.errorNetwork` });
  const runAfterAuth = useRunAfterAuth(wrapSubmit);
  const strengthValue = Password.strength(password);

  const requirements = [
    {
      check: Password.requirementChecks[0]?.check ?? (() => false),
      label: t(`registerPage.requirementMin`, { min: Password.minLength }),
    },
    { check: Password.requirementChecks[1]?.check ?? (() => false), label: t(`registerPage.requirementLetters`) },
  ];

  const strengthBarWidth =
    password.length === 0 ? `0%` : strengthValue === `weak` ? `33%` : strengthValue === `medium` ? `66%` : `100%`;

  const strengthText =
    strengthValue === `weak`
      ? t(`registerPage.strengthWeak`)
      : strengthValue === `medium`
        ? t(`registerPage.strengthMedium`)
        : t(`registerPage.strengthStrong`);

  const onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!Password.valid(password)) {
      setError(t(`registerPage.passwordRule`, { min: Password.minLength }));

      return;
    }
    runAfterAuth(async () => {
      await api.register(email.trim(), password);
    });
  };

  const onGeneratePassword = () => setPassword(Password.generate());

  return {
    email,
    error,
    loading,
    onEmailChange: setEmail,
    onGeneratePassword,
    onPasswordChange: setPassword,
    onSubmit,
    password,
    passwordValid: Password.valid(password),
    requirements,
    strength: strengthValue,
    strengthBarWidth,
    strengthText,
  };
};
