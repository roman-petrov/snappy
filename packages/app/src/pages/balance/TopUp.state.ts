import { useState } from "react";

import { api, t } from "../../core";

export const useTopUpState = () => {
  const [amountText, setAmountText] = useState(``);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(``);
    const amount = Number(amountText.replace(`,`, `.`));
    if (!Number.isFinite(amount) || amount <= 0) {
      setError(t(`balance.topUpErrors.invalid`));

      return;
    }
    setLoading(true);
    try {
      const result = await api.balancePaymentUrl({ amount });
      if (result.status === `ok`) {
        window.location.assign(result.url);

        return;
      }
      if (result.status === `invalidAmount`) {
        setError(t(`balance.topUpErrors.invalidAmount`));

        return;
      }
      setError(t(`balance.topUpErrors.payment`));
    } finally {
      setLoading(false);
    }
  };

  return { amountText, error, loading, setAmountText, submit };
};
