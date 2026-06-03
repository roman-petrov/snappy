import { i } from "@snappy/intl";
import { Chip, IconButton, Link, Page } from "@snappy/ui";
import { Pencil } from "lucide-react";

import type { useUserListState } from "./UserList.state";

import { Pager, Table } from "../../components";
import { t } from "../../core";
import { Routes } from "../../Routes";

export type UserListViewProps = ReturnType<typeof useUserListState>;

export const UserListView = ({ items, page, pageSize, setPage, total }: UserListViewProps) => (
  <Page title={t(`users.list.title`)}>
    <Table
      columns={([`email`, `balance`, `createdAt`, `emailVerified`, `actions`] as const).map(key => ({
        content: t(`users.list.columns.${key}`),
        key,
        ...(key === `actions` || key === `balance` ? { align: `right` as const } : {}),
      }))}
      rows={items.map(item => ({
        actions: (
          <IconButton icon={Pencil} link={Routes.user.edit({ userId: item.id })} tip={t(`users.list.editTip`)} />
        ),
        balance: i.price(item.balanceRub),
        createdAt: i.date(item.createdAt),
        email: <Link link={Routes.user.edit({ userId: item.id })} text={item.email} />,
        emailVerified: (
          <Chip
            color={item.emailVerified ? `success` : `soft`}
            text={item.emailVerified ? t(`users.list.verifiedYes`) : t(`users.list.verifiedNo`)}
          />
        ),
        id: item.id,
      }))}
    />
    <Pager page={page} pageSize={pageSize} setPage={setPage} total={total} />
  </Page>
);
