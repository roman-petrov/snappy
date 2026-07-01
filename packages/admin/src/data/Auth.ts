import type { TrpcClient } from "@snappy/admin-server-api";

export const Auth = (trpc: TrpcClient) => {
  const signIn = async (username: string, password: string) => trpc.auth.signIn.mutate({ password, username });
  const signOut = async () => trpc.auth.signOut.mutate();

  const signedIn = async () =>
    trpc.auth.session
      .query()
      .then(({ ok }) => ok)
      .catch(() => false);

  return { signedIn, signIn, signOut };
};
