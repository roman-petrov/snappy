import { useAuthSubmit } from "@snappy/ui";
import { useState } from "react";

import { Auth } from "../../core";
import { Routes } from "../../Routes";
import { $signedIn } from "../../Store";

export const useSignInState = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const { error, loading, onSubmit } = useAuthSubmit({ homePath: Routes.home, setSignedIn: $signedIn.set });
  const submit = () => onSubmit(async () => Auth.signIn(email.trim(), password));

  return { email, error, loading, password, setEmail, setPassword, submit };
};
