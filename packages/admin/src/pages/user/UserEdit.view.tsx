import { Button, EmailInput, ErrorAlert, IconButton, Input, NumberInput, Page } from "@snappy/ui";
import { Copy } from "lucide-react";

import type { useUserEditState } from "./UserEdit.state";

import { t } from "../../core";
import styles from "./UserEdit.module.scss";

export type UserEditViewProps = ReturnType<typeof useUserEditState>;

export const UserEditView = ({ balance, copyId, error, loading, remove, save, setBalance, user }: UserEditViewProps) =>
  user === undefined ? undefined : (
    <Page back title={t(`users.edit.title`)}>
      <div className={styles.form}>
        <Input
          disabled
          label={t(`users.edit.id`)}
          suffix={<IconButton icon={Copy} onClick={copyId} tip={t(`users.edit.copyId`)} />}
          value={user.id}
        />
        <EmailInput disabled label={t(`users.edit.email`)} value={user.email} />
        <NumberInput disabled={loading} label={t(`users.edit.balance`)} onChange={setBalance} value={balance} />
        {error === undefined ? undefined : <ErrorAlert text={t(error.key)} />}
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
