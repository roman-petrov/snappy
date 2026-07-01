/* eslint-disable functional/no-expression-statements */
import type { TrpcRouter } from "@snappy/admin-server-api";

import { Store } from "@snappy/core";
import { ReactiveStore } from "@snappy/store";
import { TrpcClient } from "@snappy/ui";

import { Auth } from "./Auth";
import { Users } from "./Users";

export const $data = await (async () => {
  const trpc = TrpcClient<TrpcRouter>(`/api/admin/trpc`);
  const api = Auth(trpc);
  const $signedIn = Store(await api.signedIn());
  const usersModule = Users(trpc);

  const auth = ReactiveStore($signedIn, {
    login: async (username: string, password: string) => {
      const result = await api.signIn(username, password);
      if (result.status === `ok`) {
        $signedIn.set(true);
      }

      return result;
    },
    signOut: async () => {
      await api.signOut();
      $signedIn.set(false);
    },
  });

  $signedIn.subscribe(ok => {
    if (!ok) {
      usersModule.clear();
    }
  });

  return { auth, users: usersModule.users };
})();
