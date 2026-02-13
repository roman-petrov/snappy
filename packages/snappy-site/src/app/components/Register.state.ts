import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../core/Api";
import { setToken } from "../core/Auth";
import { t } from "../core/Locale";
import {
  generatePassword,
  passwordMinLength,
  passwordRequirementChecks,
  passwordStrength,
  passwordValid,
} from "../core/Password";

export const useRegisterState = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const strength = passwordStrength(password);

  const requirements = [
    { check: passwordRequirementChecks[0]!.check, label: t(`registerPage.requirementMin`, { min: passwordMinLength }) },
    { check: passwordRequirementChecks[1]!.check, label: t(`registerPage.requirementLetters`) },
  ];

  const strengthBarWidth =
    password.length === 0 ? `0%` : strength === `weak` ? `33%` : strength === `medium` ? `66%` : `100%`;

  const strengthText =
    strength === `weak`
      ? t(`registerPage.strengthWeak`)
      : strength === `medium`
        ? t(`registerPage.strengthMedium`)
        : t(`registerPage.strengthStrong`);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(``);
    if (!passwordValid(password)) {
      setError(t(`registerPage.passwordRule`, { min: passwordMinLength }));

      return;
    }
    setLoading(true);
    try {
      const { token } = await api.register(email.trim(), password);
      setToken(token);
      navigate(`/`, { replace: true, viewTransition: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t(`registerPage.errorNetwork`));
    } finally {
      setLoading(false);
    }
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
