import { useSignalState } from "@snappy/ui";

export const useAsyncSubmit = () => {
  const [error, setError] = useSignalState(``);
  const [loading, setLoading] = useSignalState(false);

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
