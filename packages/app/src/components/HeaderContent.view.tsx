import { IconButton, SystemButtons } from "@snappy/ui";

import type { useHeaderContentState } from "./HeaderContent.state";

import { t } from "../core";
import { Routes } from "../Routes";
import { BalanceTap } from "./BalanceTap";
import styles from "./HeaderContent.module.scss";

export type HeaderContentViewProps = ReturnType<typeof useHeaderContentState>;

export const HeaderContentView = ({ loggedIn }: HeaderContentViewProps) => (
  <div className={styles.root}>
    <SystemButtons />
    {loggedIn ? (
      <>
        <IconButton icon="settings" link={Routes.settings.root} tip={t(`settings.root.title`)} />
        <BalanceTap />
      </>
    ) : undefined}
  </div>
);
