import { useAsyncSubmit } from "@snappy/ui";
import { useState } from "react";

import { trpc } from "../../../core";

export const useSettingsProfileTopUpState = () => {
  const [amountText, setAmountText] = useState(``);
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit();

  const submit = () => {
    const amount = Number(amountText.replace(`,`, `.`));
    if (!Number.isFinite(amount) || amount <= 0) {
      setError({ key: `settings.profile.topUp.errors.invalid` });

      return;
    }
    void wrapSubmit(async () => {
      const result = await trpc.balance.paymentUrl.mutate({ amount });
      if (result.status === `ok`) {
        window.location.assign(result.url);

        return;
      }
      if (result.status === `invalidAmount`) {
        setError({ key: `settings.profile.topUp.errors.invalidAmount` });

        return;
      }
      setError({ key: `settings.profile.topUp.errors.payment` });
    });
  };

  return { amountText, error, loading, setAmountText, submit };
};
