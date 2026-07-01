import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { $data } from "../../../../data";

export const useSettingsProfileState = () => {
  const { balance } = $data.balance();
  const [email, setEmail] = useState<string>();

  useAsyncEffect(async () => setEmail((await $data.auth.user())?.email), []);

  const signOut = async () => $data.auth.signOut();

  return { balance, email, signOut };
};
