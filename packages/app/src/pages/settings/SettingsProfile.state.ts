import { useAsyncEffect, useGo } from "@snappy/ui";
import { useState } from "react";

import { Auth } from "../../core";
import { Routes } from "../../Routes";
import { $signedIn } from "../../Store";

export const useSettingsProfileState = () => {
  const go = useGo();
  const [email, setEmail] = useState<string>();

  useAsyncEffect(async () => {
    const profile = await Auth.user();
    setEmail(profile?.email);
  }, []);

  const signOut = async () => {
    await Auth.signOut();
    $signedIn.set(false);
    void go(Routes.signIn, { replace: true });
  };

  return { email, signOut };
};
