import type { MouseEventHandler } from "react";

import { Link } from "@snappy/ui";

import { t } from "../locales";
import styles from "./SiteHeaderNav.module.scss";

export type SiteHeaderNavProps = { followSection: MouseEventHandler<HTMLElement>; links: readonly string[] };

export const SiteHeaderNav = ({ followSection, links }: SiteHeaderNavProps) => (
  <nav className={styles.root} onClickCapture={followSection}>
    {links.map(key => (
      <Link key={key} link={{ href: `/#${key}` }} muted text={t(`nav.${key}`)} />
    ))}
  </nav>
);
