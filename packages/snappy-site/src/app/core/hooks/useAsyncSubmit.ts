import { useState } from "react";

import { t } from "../Locale";

export type UseAsyncSubmitOptions = { errorKey: string };

export const useAsyncSubmit = (options: UseAsyncSubmitOptions) => {
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
  const defaultMessage = t(options.errorKey);

  const wrapSubmit = async (fn: () => Promise<void>) => {
    setError(``);
    setLoading(true);
    try {
      await fn();
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : defaultMessage);
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, setError, wrapSubmit };
};
