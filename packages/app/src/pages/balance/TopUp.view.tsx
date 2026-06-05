import { Button, Input, Page } from "@snappy/ui";

import type { useTopUpState } from "./TopUp.state";

import { FormErrorAndActions } from "../../components";
import { t } from "../../core";

export type TopUpViewProps = ReturnType<typeof useTopUpState>;

export const TopUpView = ({ amountText, error, loading, setAmountText, submit }: TopUpViewProps) => (
  <Page back title={t(`balance.topUp.title`)}>
    <p>{t(`balance.topUp.lead`)}</p>
    <Input
      disabled={loading}
      label={t(`balance.topUp.amountLabel`)}
      onChange={setAmountText}
      type="text"
      value={amountText}
    />
    <FormErrorAndActions error={error === undefined ? `` : t(error.key, error.params)}>
      <Button
        disabled={loading}
        onClick={submit}
        text={loading ? t(`balance.topUp.submitting`) : t(`balance.topUp.submit`)}
        type="primary"
      />
    </FormErrorAndActions>
  </Page>
);
