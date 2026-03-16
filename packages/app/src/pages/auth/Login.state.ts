import { useState } from "react";

import { api } from "../../core";
import { useAuthSubmit } from "../../hooks";

export const useLoginState = () => {
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const { error, loading, onSubmit } = useAuthSubmit(`loginPage`);
  const submit = () => onSubmit(async () => api.login(email.trim(), password));

  return { email, error, loading, password, setEmail, setPassword, submit };
};
