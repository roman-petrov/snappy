import { Button, Input } from "@snappy/ui";

import type { useForgotPasswordState } from "./ForgotPassword.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { AuthForm, AuthSubmitActions, MessageWithLink } from "./components";

export type ForgotPasswordViewProps = ReturnType<typeof useForgotPasswordState>;

export const ForgotPasswordView = ({ email, error, loading, screen, setEmail, submit }: ForgotPasswordViewProps) => (
  <AuthForm lead={t(`auth.forgotPassword.lead`)} submit={submit} title={t(`auth.forgotPassword.title`)}>
    {screen === `sent` ? (
      <MessageWithLink
        lead={t(`auth.forgotPassword.checkEmailLead`)}
        linkText={t(`auth.forgotPassword.backToSignIn`)}
        linkTo={Routes.signIn}
        title={t(`auth.forgotPassword.checkEmail`)}
      />
    ) : (
      <>
        <Input
          autoComplete="email"
          label={t(`auth.forgotPassword.email`)}
          onChange={setEmail}
          required
          type="email"
          value={email}
        />
        <AuthSubmitActions
          disabled={loading}
          error={error === undefined ? `` : t(error.key, error.params)}
          loading={loading}
          submit={t(`auth.forgotPassword.submit`)}
          submitting={t(`auth.forgotPassword.submitting`)}
        >
          <Button link={Routes.signIn} text={t(`auth.signIn.title`)} />
        </AuthSubmitActions>
      </>
    )}
  </AuthForm>
);
