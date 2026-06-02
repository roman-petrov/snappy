import { useAuthSubmit } from "@snappy/ui";
import { useState } from "react";

import { Auth, Password } from "../../core";
import { Routes } from "../../Routes";
import { $signedIn } from "../../Store";

export const useSignUpState = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const { error, loading, onSubmit, setError } = useAuthSubmit({ homePath: Routes.home, setSignedIn: $signedIn.set });
  const { generate, minLength, requirementChecks, strength: strengthOf } = Password;
  const strength = strengthOf(password);
  const runCheck = (index: number) => (requirementChecks[index]?.check ?? (() => false))(password);
  const requirements = { letters: runCheck(1), minLength: runCheck(0) };

  const strengthBarWidth =
    password.length === 0 ? `0%` : strength === `weak` ? `33%` : strength === `medium` ? `66%` : `100%`;

  const meetsMinLength = password.length >= minLength;

  const submit = () => {
    if (!meetsMinLength) {
      setError(`passwordRule`);

      return;
    }
    onSubmit(async () => Auth.signUp(email.trim(), password));
  };

  const generatePassword = () => setPassword(generate());
  const submitDisabled = loading || !meetsMinLength;

  const view = {
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
  };

  return view;
};
