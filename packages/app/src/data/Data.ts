/* eslint-disable functional/no-expression-statements */
import type { TrpcRouter } from "@snappy/app-server-api";

import { Store } from "@snappy/core";
import { ReactiveStore } from "@snappy/store";
import { TrpcClient } from "@snappy/ui";

import { KnownUser } from "../core";
import { Auth } from "./Auth";
import { Balance } from "./Balance";
import { Feed } from "./Feed";
import { UserSettings } from "./UserSettings";

export const $data = await (async () => {
  const trpc = TrpcClient<TrpcRouter>(`/api/trpc`);
  const $signedIn = Store(await Auth.signedIn());
  const userSettings = UserSettings(trpc);
  const balanceModule = Balance(trpc);
  const feedModule = Feed(trpc);
  const load = async () => Promise.all([userSettings.load(), balanceModule.load()]);

  const clear = () => {
    feedModule.clear();
    userSettings.clear();
    balanceModule.clear();
  };

  const auth = ReactiveStore($signedIn, {
    changePassword: Auth.changePassword,
    login: async (email: string, password: string) => {
      const result = await Auth.signIn(email, password);
      if (result.status === `ok`) {
        $signedIn.set(true);
      }

      return result;
    },
    requestPasswordReset: Auth.requestPasswordReset,
    resetPassword: Auth.resetPassword,
    sendVerificationEmail: Auth.sendVerificationEmail,
    signOut: async () => {
      await Auth.signOut();
      $signedIn.set(false);
    },
    signUp: Auth.signUp,
    sync: async () => {
      if (await Auth.signedIn()) {
        $signedIn.set(true);
      }
    },
    user: Auth.user,
  });

  if ($signedIn()) {
    KnownUser.mark();
    void load();
  }
  $signedIn.subscribe(ok => {
    if (ok) {
      KnownUser.mark();
      void load();
    } else {
      clear();
    }
  });

  return {
    aiConfig: userSettings.aiConfig,
    auth,
    balance: balanceModule.balance,
    feed: feedModule.feed,
    settings: userSettings.settings,
  };
})();
