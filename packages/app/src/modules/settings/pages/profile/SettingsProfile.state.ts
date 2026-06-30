import { i } from "@snappy/intl";
import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { Auth, trpc } from "../../../../core";
import { $signedIn } from "../../../../Store";

export const useSettingsProfileState = () => {
  const [balanceEnd, setBalanceEnd] = useState<string>();
  const [email, setEmail] = useState<string>();

  useAsyncEffect(async () => {
    const [profile, balance] = await Promise.all([Auth.user(), trpc.user.balance.query()]);
    setBalanceEnd(i.price(balance));
    setEmail(profile?.email);
  }, []);

  const signOut = async () => {
    await Auth.signOut();
    $signedIn.set(false);
  };

  return { balanceEnd, email, signOut };
};
