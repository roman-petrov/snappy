import { useState } from "react";

import { Auth, Password } from "../../core";
import { useAuthSubmit } from "../../hooks";

export type RegisterRequirementResult = { labelKey: string; met: boolean; params?: { min?: number } };

export const useRegisterState = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const { error, loading, onSubmit, setError } = useAuthSubmit(`registerPage`);
  const strength = Password.strength(password);

  const requirementResults: RegisterRequirementResult[] = [
    {
      labelKey: `registerPage.requirementMin`,
      met: (Password.requirementChecks[0]?.check ?? (() => false))(password),
      params: { min: Password.minLength },
    },
    {
      labelKey: `registerPage.requirementLetters`,
      met: (Password.requirementChecks[1]?.check ?? (() => false))(password),
    },
  ];

  const strengthBarWidth =
    password.length === 0 ? `0%` : strength === `weak` ? `33%` : strength === `medium` ? `66%` : `100%`;

  const meetsMinLength = password.length >= Password.minLength;

  const submit = () => {
    if (!meetsMinLength) {
      setError({ key: `registerPage.passwordRule`, params: { min: Password.minLength } });

      return;
    }
    onSubmit(async () => Auth.signUp(email.trim(), password));
  };

  const generatePassword = () => setPassword(Password.generate());

  return {
    email,
    error,
    generatePassword,
    loading,
    minLength: Password.minLength,
    password,
    requirementResults,
    setEmail,
    setPassword,
    strength,
    strengthBarWidth,
    submit,
    submitDisabled: loading || !meetsMinLength,
  };
};
