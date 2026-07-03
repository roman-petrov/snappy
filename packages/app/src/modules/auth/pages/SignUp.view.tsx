import { Button, NewPasswordInput } from "@snappy/ui";

import type { useSignUpState } from "./SignUp.state";

import { t } from "../../../core";
import { Routes } from "../../../Routes";
import { AuthEmailForm, SignUpConsent } from "../components";

export type SignUpViewProps = ReturnType<typeof useSignUpState>;

export const SignUpView = ({
  consented,
  email,
  password,
  send,
  sent,
  setConsented,
  setEmail,
  setPassword,
  submitDisabled,
}: SignUpViewProps) => (
  <AuthEmailForm
    email={email}
    emailLabel={t(`auth.signUp.email`)}
    errorsKey="auth.signUp.errors"
    footer={<Button link={Routes.auth.signIn} text={sent ? t(`auth.signUp.backToSignIn`) : t(`auth.signIn.title`)} />}
    formTitle={t(`auth.signUp.title`)}
    send={send}
    sendingLabel={t(`auth.signUp.submitting`)}
    sendLabel={t(`auth.signUp.submit`)}
    sent={sent}
    sentLead={t(`auth.signUp.checkEmailLead`)}
    sentTitle={t(`auth.signUp.checkEmail`)}
    setEmail={setEmail}
    submitDisabled={submitDisabled}
  >
    <NewPasswordInput
      disabled={send.loading}
      label={t(`auth.signUp.password`)}
      onChange={setPassword}
      value={password}
    />
    <SignUpConsent checked={consented} disabled={send.loading} onChange={setConsented} />
  </AuthEmailForm>
);
