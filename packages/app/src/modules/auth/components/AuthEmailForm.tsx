import type { ReactNode } from "react";

import { Input } from "@snappy/ui";

import { AuthEmailActions, type AuthEmailActionsProps } from "./AuthEmailActions";
import { AuthForm } from "./AuthForm";

export type AuthEmailFormProps = {
  children?: ReactNode;
  email: string;
  emailLabel: string;
  errorsKey: string;
  footer?: ReactNode;
  formLead?: string;
  formTitle: string;
  send: Pick<AuthEmailActionsProps, `cooldownSec` | `disabled` | `error` | `loading` | `onSend`>;
  sendingLabel: string;
  sendLabel: string;
  sent: boolean;
  sentLead: string;
  sentTitle: string;
  setEmail: (value: string) => void;
  submitDisabled?: boolean;
  submitTag?: string;
};

export const AuthEmailForm = ({
  children,
  email,
  emailLabel,
  errorsKey,
  footer,
  formLead,
  formTitle,
  send,
  sendingLabel,
  sendLabel,
  sent,
  sentLead,
  sentTitle,
  setEmail,
  submitDisabled,
  submitTag,
}: AuthEmailFormProps) => (
  <AuthForm lead={sent ? sentLead : formLead} submit={send.onSend} title={sent ? sentTitle : formTitle}>
    {sent ? (
      <AuthEmailActions errorsKey={errorsKey} {...send} sendingLabel={sendingLabel}>
        {footer}
      </AuthEmailActions>
    ) : (
      <>
        <Input autoComplete="email" label={emailLabel} onChange={setEmail} value={email} />
        {children}
        <AuthEmailActions
          errorsKey={errorsKey}
          {...send}
          disabled={submitDisabled ?? send.disabled}
          sendingLabel={sendingLabel}
          sendLabel={sendLabel}
          submit
          tag={submitTag}
        >
          {footer}
        </AuthEmailActions>
      </>
    )}
  </AuthForm>
);
