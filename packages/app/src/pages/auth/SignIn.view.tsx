import { Button, Input, PasswordInput } from "@snappy/ui";

import type { useSignInState } from "./SignIn.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { AuthEmailActions, authError, AuthForm, AuthSubmitActions } from "./components";

export type SignInViewProps = ReturnType<typeof useSignInState>;

export const SignInView = ({
  back,
  cooldownSec,
  email,
  error,
  loading,
  password,
  resend,
  screen,
  setEmail,
  setPassword,
  submit,
  submitDisabled,
}: SignInViewProps) => (
  <AuthForm
    lead={screen === `unverified` ? t(`auth.signIn.unverifiedLead`) : undefined}
    submit={screen === `unverified` ? resend.onSend : submit}
    title={screen === `unverified` ? t(`auth.signIn.unverified`) : t(`auth.signIn.title`)}
  >
    {screen === `unverified` ? (
      <AuthEmailActions
        errorsKey="auth.signIn.errors"
        {...resend}
        sendingLabel={t(`auth.signIn.submitting`)}
        sendLabel={t(`auth.resendVerification`)}
      >
        <Button onClick={back} text={t(`auth.signIn.backToForm`)} />
      </AuthEmailActions>
    ) : (
      <>
        <Input
          autoComplete="email"
          label={t(`auth.signIn.email`)}
          onChange={setEmail}
          value={email}
        />
        <PasswordInput
          autoComplete="current-password"
          disabled={loading}
          label={t(`auth.signIn.password`)}
          onChange={setPassword}
          value={password}
        />
        <AuthSubmitActions
          disabled={submitDisabled}
          error={authError(error, `auth.signIn.errors`, cooldownSec)}
          loading={loading}
          submit={t(`auth.signIn.submit`)}
          submitting={t(`auth.signIn.submitting`)}
        >
          <Button link={Routes.forgotPassword} text={t(`auth.signIn.forgotPassword`)} />
          <Button link={Routes.signUp} text={t(`auth.signIn.signUpLink`)} />
        </AuthSubmitActions>
      </>
    )}
  </AuthForm>
);
