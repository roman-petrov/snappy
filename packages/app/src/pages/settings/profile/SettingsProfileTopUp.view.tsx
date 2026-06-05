import { Button, Input, Page } from "@snappy/ui";

import type { useSettingsProfileTopUpState } from "./SettingsProfileTopUp.state";

import { FormErrorAndActions } from "../../../components";
import { t } from "../../../core";
import { SettingsCard } from "../components";

export type SettingsProfileTopUpViewProps = ReturnType<typeof useSettingsProfileTopUpState>;

export const SettingsProfileTopUpView = ({
  amountText,
  error,
  loading,
  setAmountText,
  submit,
}: SettingsProfileTopUpViewProps) => (
  <Page back title={t(`settings.profile.topUp.title`)}>
    <SettingsCard form lead={t(`settings.profile.topUp.lead`)}>
      <Input
        disabled={loading}
        label={t(`settings.profile.topUp.amountLabel`)}
        onChange={setAmountText}
        type="text"
        value={amountText}
      />
      <FormErrorAndActions error={error === undefined ? `` : t(error.key, error.params)}>
        <Button
          disabled={loading}
          onClick={submit}
          text={loading ? t(`settings.profile.topUp.submitting`) : t(`settings.profile.topUp.submit`)}
          type="primary"
        />
      </FormErrorAndActions>
    </SettingsCard>
  </Page>
);
