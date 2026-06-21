import type { TrpcOutputs } from "@snappy/admin-server-api";

import { useRouterGo } from "@snappy/app-router";
import { useAsyncEffect, useAsyncSubmit } from "@snappy/ui";
import { useState } from "react";

import type { UserEditProps } from "./UserEdit";

import { Confirm, t, trpc } from "../../core";
import { Routes } from "../../Routes";

export const useUserEditState = ({ userId: id }: UserEditProps) => {
  const go = useRouterGo();
  const [user, setUser] = useState<TrpcOutputs[`users`][`read`]>();
  const [balanceText, setBalanceText] = useState(``);
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit();

  useAsyncEffect(async () => {
    const data = await trpc.users.read.query({ id });
    setUser(data);
    if (data !== undefined) {
      setBalanceText(String(data.balanceRub));
    }
  }, [id]);

  const save = () => {
    const balanceRub = Number(balanceText.replace(`,`, `.`));
    if (!Number.isFinite(balanceRub) || balanceRub < 0) {
      setError({ key: `users.edit.errors.invalid` });

      return;
    }
    void wrapSubmit(async () => {
      await trpc.users.update.mutate({ balanceRub, id });
      await go(Routes.user.list);
    });
  };

  const remove = async () => {
    if (!Confirm(t(`users.edit.deleteConfirm`))) {
      return;
    }
    await trpc.users.delete.mutate({ id });
    await go(Routes.user.list);
  };

  return { balanceText, error, loading, remove, save, setBalanceText, user };
};
