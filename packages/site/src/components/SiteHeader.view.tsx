import { Header, Link, SystemButtons } from "@snappy/ui";

import type { useSiteHeaderState } from "./SiteHeader.state";

import { t } from "../core";
import styles from "./SiteHeader.module.scss";

export type SiteHeaderViewProps = ReturnType<typeof useSiteHeaderState>;

export const SiteHeaderView = ({ navItems }: SiteHeaderViewProps) => (
  <Header cn={styles.siteHeader}>
    {navItems.map(({ key, link }) => (
      <Link key={key} link={link} muted text={t(key)} />
    ))}
    <SystemButtons />
  </Header>
);
