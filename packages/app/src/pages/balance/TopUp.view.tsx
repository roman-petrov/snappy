import { Button, Input } from "@snappy/ui";

import type { useTopUpState } from "./TopUp.state";

import { Page } from "../../components";
import { t } from "../../core";
import { FormErrorAndActions } from "../auth/components";

export type TopUpViewProps = ReturnType<typeof useTopUpState>;

export const TopUpView = ({ amountText, error, loading, setAmountText, submit }: TopUpViewProps) => (
  <Page back title={t(`balance.topUpTitle`)}>
    <p>{t(`balance.topUpLead`)}</p>
    <Input
      disabled={loading}
      label={t(`balance.amountLabel`)}
      onChange={setAmountText}
      type="text"
      value={amountText}
    />
    <FormErrorAndActions error={error}>
      <Button
        disabled={loading}
        onClick={submit}
        text={loading ? t(`balance.topUpSubmitting`) : t(`balance.topUpSubmit`)}
        type="primary"
      />
    </FormErrorAndActions>
  </Page>
);
