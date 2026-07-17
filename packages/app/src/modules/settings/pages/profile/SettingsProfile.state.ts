import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { r } from "../../../../data";

export const useSettingsProfileState = () => {
  const balance = r.balance();
  const [email, setEmail] = useState<string>();

  useAsyncEffect(async () => setEmail((await r.auth.user())?.email), []);

  const signOut = async () => r.auth.signOut();

  return { balance, email, signOut };
};
