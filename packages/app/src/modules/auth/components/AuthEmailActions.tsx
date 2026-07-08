import type { ReactNode } from "react";

import { CooldownButton } from "@snappy/ui";

import { FormActions, FormErrorAndActions } from "../../../components";
import { authError } from "./AuthError";

export type AuthEmailActionsProps = {
  children?: ReactNode;
  cooldownSec: number;
  disabled: boolean;
  error?: string;
  errorsKey: string;
  loading: boolean;
  onSend: () => void;
  sendingLabel: string;
  sendLabel?: string;
  submit?: boolean;
  tag?: string;
};

export const AuthEmailActions = ({
  children,
  cooldownSec,
  disabled,
  error,
  errorsKey,
  loading,
  onSend,
  sendingLabel,
  sendLabel,
  submit = false,
  tag,
}: AuthEmailActionsProps) => (
  <FormErrorAndActions error={authError(error, errorsKey, cooldownSec)}>
    <FormActions>
      <CooldownButton
        cooldownSec={cooldownSec}
        disabled={disabled}
        loading={loading}
        loadingText={sendingLabel}
        onClick={submit ? undefined : onSend}
        submit={submit}
        tag={tag}
        text={sendLabel}
        type="primary"
      />
      {children}
    </FormActions>
  </FormErrorAndActions>
);
