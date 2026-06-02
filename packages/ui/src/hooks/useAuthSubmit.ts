import { useAsyncSubmit } from "./useAsyncSubmit";
import { useGo } from "./useGo";

export type AuthSubmitInput = { homePath: string; setSignedIn: (value: boolean) => void };

export const useAuthSubmit = ({ homePath, setSignedIn }: AuthSubmitInput) => {
  const go = useGo();
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit<string>();

  const onSubmit = (submit: () => Promise<{ status: string }>) => {
    void wrapSubmit(async () => {
      const result = await submit();
      if (result.status !== `ok`) {
        setError(result.status);

        return;
      }
      setSignedIn(true);
      void go(homePath, { replace: true });
    });
  };

  return { error, loading, onSubmit, setError };
};
