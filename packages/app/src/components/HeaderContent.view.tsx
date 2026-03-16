import { IconButton, SystemButtons } from "@snappy/ui";

import type { useHeaderContentState } from "./HeaderContent.state";

import { t } from "../core";
import styles from "./HeaderContent.module.scss";

export type HeaderContentViewProps = ReturnType<typeof useHeaderContentState>;

export const HeaderContentView = ({ logoutOnClick }: HeaderContentViewProps) => (
  <div className={styles.root}>
    <SystemButtons />
    {logoutOnClick === undefined ? undefined : <IconButton ariaLabel={t(`settings.title`)} icon="⚙" link="/settings" />}
    {logoutOnClick === undefined ? undefined : <IconButton ariaLabel={t(`logout`)} icon="➜" onClick={logoutOnClick} />}
  </div>
);
