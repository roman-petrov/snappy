import { useState } from "react";

import { trpc } from "../../core";
import { useAsyncSubmit } from "../../hooks";

export const useTopUpState = () => {
  const [amountText, setAmountText] = useState(``);
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit();

  const submit = () => {
    const amount = Number(amountText.replace(`,`, `.`));
    if (!Number.isFinite(amount) || amount <= 0) {
      setError({ key: `balance.topUpErrors.invalid` });

      return;
    }
    void wrapSubmit(async () => {
      const result = await trpc.balance.paymentUrl.mutate({ amount });
      if (result.status === `ok`) {
        window.location.assign(result.url);

        return;
      }
      if (result.status === `invalidAmount`) {
        setError({ key: `balance.topUpErrors.invalidAmount` });

        return;
      }
      setError({ key: `balance.topUpErrors.payment` });
    });
  };

  return { amountText, error, loading, setAmountText, submit };
};
