import { IconButton } from "@snappy/ui";

import type { useHeaderContentState } from "./HeaderContent.state";

import { t } from "../core";
import { Routes } from "../Routes";
import { BalanceTap } from "./BalanceTap";
import styles from "./HeaderContent.module.scss";

export type HeaderContentViewProps = ReturnType<typeof useHeaderContentState>;

export const HeaderContentView = ({ signedIn }: HeaderContentViewProps) => (
  <div className={styles.root}>
    {signedIn ? (
      <>
        <IconButton icon="settings" link={Routes.settings.root} tip={t(`settings.root.title`)} />
        <BalanceTap />
      </>
    ) : undefined}
  </div>
);
