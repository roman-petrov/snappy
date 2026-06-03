import { useAuthSubmit } from "@snappy/ui";
import { type SubmitEventHandler, useState } from "react";

import { Auth } from "../../core";
import { Routes } from "../../Routes";
import { $signedIn } from "../../Store";

export const useSignInState = () => {
  const [username, setUsername] = useState(``);
  const [password, setPassword] = useState(``);
  const { error, loading, onSubmit } = useAuthSubmit({ homePath: Routes.user.list, setSignedIn: $signedIn.set });

  const signIn: SubmitEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    onSubmit(async () => Auth.signIn(username.trim(), password));
  };

  return { error, loading, password, setPassword, setUsername, signIn, username };
};
