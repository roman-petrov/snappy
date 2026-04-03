import { useState } from "react";

export type AsyncSubmitError = { key: string; params?: Record<string, number | string> };

export const useAsyncSubmit = <TError = AsyncSubmitError>() => {
  const [error, setError] = useState<TError | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const wrapSubmit = async (fn: () => Promise<void>) => {
    setError(undefined);
    setLoading(true);
    try {
      await fn();
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, setError, wrapSubmit };
};
