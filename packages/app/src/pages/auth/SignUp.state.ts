import { useAuthSubmit } from "@snappy/ui";
import { useState } from "react";

import { Auth, Password } from "../../core";
import { Routes } from "../../Routes";
import { $signedIn } from "../../Store";

export const useSignUpState = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const { error, loading, onSubmit } = useAuthSubmit({ homePath: Routes.$.home, setSignedIn: $signedIn.set });
  const submit = () => onSubmit(async () => Auth.signUp(email.trim(), password));
  const submitDisabled = loading || !Password.valid(password);

  return { email, error, loading, password, setEmail, setPassword, submit, submitDisabled };
};
