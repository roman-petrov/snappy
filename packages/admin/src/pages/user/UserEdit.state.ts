import { useRouterGo } from "@snappy/app-router";
import { useAsyncEffect, useAsyncSubmit } from "@snappy/ui";
import { useState } from "react";

import type { UserEditProps } from "./UserEdit";

import { Confirm, t } from "../../core";
import { $data, type User } from "../../data";
import { Routes } from "../../Routes";

export const useUserEditState = ({ userId: id }: UserEditProps) => {
  const go = useRouterGo();
  const { fetch, remove: removeUser, update } = $data.users();
  const [user, setUser] = useState<User>();
  const [balanceRub, setBalanceRub] = useState<number | undefined>(undefined);
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit();

  useAsyncEffect(async () => {
    const data = await fetch(id);
    setUser(data);
    if (data !== undefined) {
      setBalanceRub(data.balanceRub);
    }
  }, [fetch, id]);

  const save = () => {
    if (balanceRub === undefined || balanceRub < 0) {
      setError({ key: `users.edit.errors.invalid` });

      return;
    }
    void wrapSubmit(async () => {
      await update({ balanceRub, id });
      await go(Routes.user.list);
    });
  };

  const remove = async () => {
    if (!Confirm(t(`users.edit.deleteConfirm`))) {
      return;
    }
    await removeUser(id);
    await go(Routes.user.list);
  };

  return { balanceRub, error, loading, remove, save, setBalanceRub, user };
};
