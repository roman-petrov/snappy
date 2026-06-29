import { Button, NewPasswordInput, Page, PasswordInput } from "@snappy/ui";

import type { useSettingsProfilePasswordState } from "./SettingsProfilePassword.state";

import { FormErrorAndActions } from "../../../components";
import { t } from "../../../core";
import { SettingsCard } from "../components";

export type SettingsProfilePasswordViewProps = ReturnType<typeof useSettingsProfilePasswordState>;

export const SettingsProfilePasswordView = ({
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
}: SettingsProfilePasswordViewProps) => (
  <Page back title={t(`settings.profile.password.title`)}>
    <SettingsCard form>
      <PasswordInput
        autoComplete="current-password"
        disabled={loading}
        label={t(`settings.profile.password.current`)}
        onChange={setCurrentPassword}
        value={currentPassword}
      />
      <NewPasswordInput
        disabled={loading}
        label={t(`settings.profile.password.new`)}
        onChange={setNewPassword}
        value={newPassword}
      />
      <PasswordInput
        autoComplete="new-password"
        disabled={loading}
        label={t(`settings.profile.password.confirm`)}
        onChange={setConfirmPassword}
        value={confirmPassword}
      />
      <FormErrorAndActions error={error === undefined ? `` : t(`settings.profile.password.errors.${error}`)}>
        <Button
          disabled={submitDisabled}
          onClick={submit}
          text={loading ? t(`settings.profile.password.submitting`) : t(`settings.profile.password.submit`)}
          type="primary"
        />
      </FormErrorAndActions>
    </SettingsCard>
  </Page>
);
