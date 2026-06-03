import { i } from "@snappy/intl";
import { Chip, IconButton, Page } from "@snappy/ui";
import { Trash2 } from "lucide-react";

import type { useUsersState } from "./Users.state";

import { Pager, Table } from "../components";
import { t } from "../core";

export type UsersViewProps = ReturnType<typeof useUsersState>;

export const UsersView = ({
  columnKeys,
  items,
  next,
  nextDisabled,
  page,
  pageCount,
  previous,
  previousDisabled,
  remove,
}: UsersViewProps) => (
  <Page title={t(`users.title`)}>
    <Table
      columns={columnKeys.map(key => ({
        content: t(`users.columns.${key}`),
        key,
        ...(key === `actions` || key === `balance` ? { align: `right` as const } : {}),
      }))}
      rows={items.map(item => ({
        actions: <IconButton icon={Trash2} onClick={async () => remove(item.id)} tip={t(`users.deleteTip`)} />,
        balance: i.price(item.balanceRub),
        createdAt: i.date(item.createdAt),
        email: item.email,
        emailVerified: (
          <Chip
            color={item.emailVerified ? `success` : `soft`}
            text={item.emailVerified ? t(`users.verifiedYes`) : t(`users.verifiedNo`)}
          />
        ),
        id: item.id,
      }))}
    />
    <Pager
      nextDisabled={nextDisabled}
      nextText={t(`users.pager.next`)}
      onNext={next}
      onPrev={previous}
      pageText={t(`users.pager.page`, { page, pageCount })}
      prevDisabled={previousDisabled}
      prevText={t(`users.pager.prev`)}
    />
  </Page>
);
