import { useRouterGo } from "@snappy/app-router";
import { useAsyncSubmit } from "@snappy/ui";
import { useEffect, useState } from "react";

import type { UserEditProps } from "./UserEdit";

import { Confirm, t } from "../../core";
import { r } from "../../data";
import { Routes } from "../../Routes";

export const useUserEditState = ({ userId: id }: UserEditProps) => {
  const go = useRouterGo();
  const { item, remove: removeUser } = r.users;
  const [user, update] = item({ id });
  const [draft, setDraft] = useState<number>();
  const balance = draft ?? user?.balance;
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit();

  useEffect(() => {
    setDraft(undefined);
  }, [id]);

  const setBalance = (value: number | undefined) => {
    if (value !== undefined) {
      setDraft(value);
    }
  };

  const save = () => {
    if (balance === undefined || balance < 0) {
      setError({ key: `users.edit.errors.invalid` });

      return;
    }
    void wrapSubmit(async () => {
      await update({ balance });
      await go(Routes.user.list);
    });
  };

  const remove = async () => {
    if (!Confirm(t(`users.edit.deleteConfirm`))) {
      return;
    }
    await removeUser({ id });
    await go(Routes.user.list);
  };

  return { balance, error, loading, remove, save, setBalance, user };
};
