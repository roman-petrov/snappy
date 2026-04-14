import { useState } from "react";

import { Auth } from "../../core";
import { useAuthSubmit } from "../../hooks";

export const useLoginState = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const { error, loading, onSubmit } = useAuthSubmit(`loginPage`);
  const submit = () => onSubmit(async () => Auth.signIn(email.trim(), password));

  return { email, error, loading, password, setEmail, setPassword, submit };
};
