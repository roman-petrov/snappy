import { useState } from "react";

export const useAsyncSubmit = () => {
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);

  const wrapSubmit = async (fn: () => Promise<void>) => {
    setError(``);
    setLoading(true);
    try {
      await fn();
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, setError, wrapSubmit };
};
