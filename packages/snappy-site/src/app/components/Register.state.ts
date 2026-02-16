import { type SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../core/Api";
import { t } from "../core/Locale";
import {
  generatePassword,
  passwordMinLength,
  passwordRequirementChecks,
  passwordStrength,
  passwordValid,
} from "../core/Password";
import { useAsyncSubmit } from "../hooks";
import { $loggedIn } from "../Store";

export const useRegisterState = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit({ errorKey: `registerPage.errorNetwork` });
  const navigate = useNavigate();
  const strength = passwordStrength(password);

  const requirements = [
    {
      check: passwordRequirementChecks[0]?.check ?? (() => false),
      label: t(`registerPage.requirementMin`, { min: passwordMinLength }),
    },
    { check: passwordRequirementChecks[1]?.check ?? (() => false), label: t(`registerPage.requirementLetters`) },
  ];

  const strengthBarWidth =
    password.length === 0 ? `0%` : strength === `weak` ? `33%` : strength === `medium` ? `66%` : `100%`;

  const strengthText =
    strength === `weak`
      ? t(`registerPage.strengthWeak`)
      : strength === `medium`
        ? t(`registerPage.strengthMedium`)
        : t(`registerPage.strengthStrong`);

  const onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!passwordValid(password)) {
      setError(t(`registerPage.passwordRule`, { min: passwordMinLength }));

      return;
    }
    void wrapSubmit(async () => {
      await api.register(email.trim(), password);
      $loggedIn.set(true);
      void navigate(`/`, { replace: true, viewTransition: true });
    });
  };

  const onGeneratePassword = () => setPassword(generatePassword());

  return {
    email,
    error,
    loading,
    onEmailChange: setEmail,
    onGeneratePassword,
    onPasswordChange: setPassword,
    onSubmit,
    password,
    passwordValid: passwordValid(password),
    requirements,
    strength,
    strengthBarWidth,
    strengthText,
  };
};
