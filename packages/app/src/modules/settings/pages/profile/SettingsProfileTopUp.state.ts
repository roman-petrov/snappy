import { useAsyncSubmit } from "@snappy/ui";
import { useState } from "react";

import { r } from "../../../../data";

export const useSettingsProfileTopUpState = () => {
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit();

  const submit = () => {
    if (amount === undefined || amount <= 0) {
      setError({ key: `settings.profile.topUp.errors.invalid` });

      return;
    }
    void wrapSubmit(async () => {
      const result = await r.billing.paymentUrl({ amount });

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

  return { amount, error, loading, setAmount, submit };
};
