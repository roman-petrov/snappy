import type { MouseEventHandler } from "react";

import { _ } from "@snappy/core";
import { $, Button, IconButton, SystemButtons } from "@snappy/ui";
import { Menu, X } from "lucide-react";

import { t } from "../locales";
import styles from "./SiteHeaderMenu.module.scss";
import { SiteHeaderMenuLink } from "./SiteHeaderMenuLink";

export type SiteHeaderMenuProps = {
  close: () => void;
  followSection: MouseEventHandler<HTMLElement>;
  links: readonly string[];
  open: boolean;
  openMenu: () => void;
};

export const SiteHeaderMenu = ({ close, followSection, links, open, openMenu }: SiteHeaderMenuProps) => (
  <>
    <span className={styles.burger}>
      <IconButton icon={Menu} onClick={openMenu} tip={t(`nav.menu`)} />
    </span>
    {open ? (
      <div className={styles.menu}>
        <div className={styles.backdrop} onClick={close} />
        <div className={_.cn(styles.panel, $.surface(`surfaceGlass`), $.radius(`lg`))}>
          <div className={styles.panelHead}>
            <SystemButtons />
            <IconButton icon={X} onClick={close} tip={t(`nav.close`)} />
          </div>
          <nav className={styles.panelNav} onClickCapture={followSection}>
            {links.map(key => (
              <SiteHeaderMenuLink key={key} link={{ href: `/#${key}` }} text={t(`nav.${key}`)} />
            ))}
          </nav>
          <div className={styles.panelActions}>
            <Button large link={{ href: `/app` }} text={t(`cta.button`)} type="primary" />
            <Button link={{ href: `/download/snappy.apk` }} text={t(`hero.android`)} />
          </div>
        </div>
      </div>
    ) : undefined}
  </>
);
