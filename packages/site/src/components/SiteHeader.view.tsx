import { _ } from "@snappy/core";
import { $, Button, IconButton, Link, SystemButtons } from "@snappy/ui";
import { Menu, X } from "lucide-react";

import type { useSiteHeaderState } from "./SiteHeader.state";

import { t } from "../locales";
import styles from "./SiteHeader.module.scss";

export type SiteHeaderViewProps = ReturnType<typeof useSiteHeaderState>;

const links = [`how`, `can`, `tasks`, `who`, `compare`] as const;

export const SiteHeaderView = ({ close, open, openMenu }: SiteHeaderViewProps) => (
  <div className={styles.root}>
    <nav className={styles.nav}>
      {links.map(key => (
        <Link key={key} link={`#${key}`} muted text={t(`nav.${key}`)} />
      ))}
    </nav>
    <div className={styles.actions}>
      <span className={styles.system}>
        <SystemButtons />
      </span>
      <Button link={{ href: `/app` }} text={t(`nav.cta`)} type="primary" />
      <span className={styles.burger}>
        <IconButton icon={Menu} onClick={openMenu} tip={t(`nav.menu`)} />
      </span>
    </div>
    {open ? (
      <div className={styles.menu}>
        <div className={styles.backdrop} onClick={close} />
        <div className={_.cn(styles.panel, $.surface(`surfaceGlass`), $.radius(`lg`))}>
          <div className={styles.panelHead}>
            <SystemButtons />
            <IconButton icon={X} onClick={close} tip={t(`nav.close`)} />
          </div>
          <nav className={styles.panelNav}>
            {links.map(key => (
              <Link key={key} link={`#${key}`} text={t(`nav.${key}`)} />
            ))}
          </nav>
          <div className={styles.panelActions}>
            <Button large link={{ href: `/app` }} text={t(`cta.button`)} type="primary" />
            <Button link={{ href: `/download/snappy.apk` }} text={t(`hero.android`)} />
          </div>
        </div>
      </div>
    ) : undefined}
  </div>
);
