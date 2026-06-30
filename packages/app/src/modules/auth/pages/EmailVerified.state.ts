import { useRouterGo, useRouterQuery } from "@snappy/app-router";
import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { Auth } from "../../../core";
import { Routes } from "../../../Routes";
import { $signedIn } from "../../../Store";

export type EmailVerifiedFailedReason = `expired` | `invalid` | `signIn`;

const reason = (error: string): EmailVerifiedFailedReason => {
  const code = error.trim().toUpperCase();
  if (code === `TOKEN_EXPIRED`) {
    return `expired`;
  }
  if (code === `INVALID_TOKEN` || code === `USER_NOT_FOUND`) {
    return `invalid`;
  }

  return code === `` ? `signIn` : `invalid`;
};

export const useEmailVerifiedState = () => {
  const query = useRouterQuery();
  const linkError = query.get(`error`) ?? ``;
  const go = useRouterGo();
  const [failedReason, setFailedReason] = useState<EmailVerifiedFailedReason>(`signIn`);
  const [screen, setScreen] = useState<`done` | `failed` | `loading`>(`loading`);

  useAsyncEffect(async () => {
    const ok = await Auth.signedIn();
    if (ok) {
      $signedIn.set(true);
      setScreen(`done`);

      return;
    }
    setFailedReason(reason(linkError));
    setScreen(`failed`);
  }, [linkError]);

  const home = () => {
    void go(Routes.$.home, { instant: true });
  };

  return { failedReason, home, screen };
};
