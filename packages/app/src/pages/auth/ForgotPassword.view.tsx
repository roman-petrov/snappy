import { Button } from "@snappy/ui";

import type { useForgotPasswordState } from "./ForgotPassword.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { AuthEmailForm } from "./components";

export type ForgotPasswordViewProps = ReturnType<typeof useForgotPasswordState>;

export const ForgotPasswordView = ({ email, send, sent, setEmail }: ForgotPasswordViewProps) => (
  <AuthEmailForm
    email={email}
    emailLabel={t(`auth.forgotPassword.email`)}
    errorsKey="auth.forgotPassword.errors"
    footer={
      <Button link={Routes.auth.signIn} text={sent ? t(`auth.forgotPassword.backToSignIn`) : t(`auth.signIn.title`)} />
    }
    formLead={t(`auth.forgotPassword.lead`)}
    formTitle={t(`auth.forgotPassword.title`)}
    send={send}
    sendingLabel={t(`auth.forgotPassword.submitting`)}
    sendLabel={t(`auth.forgotPassword.submit`)}
    sent={sent}
    sentLead={t(`auth.forgotPassword.checkEmailLead`)}
    sentTitle={t(`auth.forgotPassword.checkEmail`)}
    setEmail={setEmail}
  />
);
