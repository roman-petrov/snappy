import { Dom } from "@snappy/browser";
import { Bridge } from "@snappy/platform";
import { Language, useAsyncSubmit } from "@snappy/ui";
import { useEffect, useState } from "react";

import { r } from "../../../data";

export const useBillingTopUpState = () => {
  type Mode = `custom` | `presets`;

  const balance = r.balance()?.balance;
  const payment = r.config()?.payment;
  const loading = payment === undefined;
  const max = payment?.max;
  const min = payment?.min;
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [mode, setMode] = useState<Mode>(`presets`);
  const [redirecting, setRedirecting] = useState(false);
  const { error, setError, wrapSubmit } = useAsyncSubmit<string>();

  useEffect(() => Dom.subscribe(window, `pageshow`, () => setRedirecting(false)), []);

  const pay = (value: number | undefined) => {
    if (payment === undefined) {
      return;
    }
    setError(undefined);
    if (value === undefined || value <= 0) {
      setError(`invalid`);

      return;
    }
    if (value < payment.min || value > payment.max) {
      setError(`invalidAmount`);

      return;
    }
    void wrapSubmit(async () => {
      setRedirecting(true);
      const result = await r.billing.paymentUrl({ amount: value, culture: Language.locale() });
      if (result.status === `ok`) {
        window.location.assign(result.url);
        if (Bridge.available) {
          setRedirecting(false);
        }

        return;
      }
      setRedirecting(false);
      if (result.status === `invalidAmount`) {
        setError(`invalidAmount`);

        return;
      }
      setError(`payment`);
    });
  };

  const selectMode = (next: Mode) => {
    setError(undefined);
    setMode(next);
  };

  return { amount, balance, error, loading, max, min, mode, pay, redirecting, setAmount, setMode: selectMode };
};
