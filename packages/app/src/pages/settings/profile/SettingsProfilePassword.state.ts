import { useRouterGo } from "@snappy/app-router";
import { useAsyncSubmit } from "@snappy/ui";
import { useState } from "react";

import { Auth, Password } from "../../../core";
import { Routes } from "../../../Routes";

export const useSettingsProfilePasswordState = () => {
  const go = useRouterGo();
  const [currentPassword, setCurrentPassword] = useState(``);
  const [newPassword, setNewPassword] = useState(``);
  const [confirmPassword, setConfirmPassword] = useState(``);
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit<string>();
  const submitDisabled = loading || currentPassword === `` || !Password.valid(newPassword);

  const submit = () => {
    if (newPassword !== confirmPassword) {
      setError(`passwordMismatch`);

      return;
    }
    void wrapSubmit(async () => {
      const result = await Auth.changePassword(currentPassword, newPassword);
      if (result.status !== `ok`) {
        setError(result.status);

        return;
      }
      void go(Routes.settings.profile.root, { replace: true });
    });
  };

  return {
    confirmPassword,
    currentPassword,
    error,
    loading,
    newPassword,
    setConfirmPassword,
    setCurrentPassword,
    setNewPassword,
    submit,
    submitDisabled,
  };
};
