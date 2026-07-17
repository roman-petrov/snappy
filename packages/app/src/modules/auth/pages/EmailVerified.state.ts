import { useRouterGo, useRouterQuery } from "@snappy/app-router";
import { useStoreValue } from "@snappy/store";
import { useAsyncEffect } from "@snappy/ui";
import { useEffect, useState } from "react";

import { r } from "../../../data";
import { Routes } from "../../../Routes";

export type EmailVerifiedFailedReason = `expired` | `invalid` | `signIn`;

export const useEmailVerifiedState = () => {
  const query = useRouterQuery();
  const linkError = query.get(`error`) ?? ``;
  const go = useRouterGo();
  const signedIn = useStoreValue(r.auth);
  const [failedReason, setFailedReason] = useState<EmailVerifiedFailedReason>(`signIn`);
  const [screen, setScreen] = useState<`done` | `failed` | `loading`>(`loading`);
  const [synced, setSynced] = useState(false);

  useAsyncEffect(async () => {
    setSynced(false);
    await r.auth.sync();
    setSynced(true);
  }, [linkError]);

  useEffect(() => {
    if (!synced) {
      return;
    }
    if (signedIn) {
      setScreen(`done`);

      return;
    }
    const code = linkError.trim().toUpperCase();
    setFailedReason(code === `TOKEN_EXPIRED` ? `expired` : code === `` ? `signIn` : `invalid`);
    setScreen(`failed`);
  }, [linkError, signedIn, synced]);

  const home = async () => go(Routes.$.home, { instant: true });

  return { failedReason, home, screen };
};
