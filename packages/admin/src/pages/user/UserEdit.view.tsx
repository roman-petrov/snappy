import { _ } from "@snappy/core";
import { Alert, Button, Input, Page } from "@snappy/ui";

import type { useUserEditState } from "./UserEdit.state";

import { t } from "../../core";
import styles from "./UserEdit.module.scss";

export type UserEditViewProps = ReturnType<typeof useUserEditState>;

export const UserEditView = ({ balanceText, error, loading, remove, save, setBalanceText, user }: UserEditViewProps) =>
  user === undefined ? undefined : (
    <Page back title={t(`users.edit.title`)}>
      <div className={styles.form}>
        <Input disabled label={t(`users.edit.email`)} onChange={_.noop} value={user.email} />
        <Input
          disabled={loading}
          label={t(`users.edit.balance`)}
          onChange={setBalanceText}
          type="text"
          value={balanceText}
        />
        {error === undefined ? undefined : <Alert text={t(error.key)} type="error" />}
        <div className={styles.actions}>
          <Button
            disabled={loading}
            onClick={save}
            text={loading ? t(`users.edit.submitting`) : t(`users.edit.submit`)}
            type="primary"
          />
          <Button disabled={loading} onClick={remove} text={t(`users.edit.delete`)} />
        </div>
      </div>
    </Page>
  );
