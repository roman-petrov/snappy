import { Button, SystemButtons } from "@snappy/ui";

import type { useSiteHeaderState } from "./SiteHeader.state";

import { AppTags } from "../AppTags";
import { t } from "../locales";
import styles from "./SiteHeader.module.scss";
import { SiteHeaderMenu } from "./SiteHeaderMenu";
import { SiteHeaderNav } from "./SiteHeaderNav";

export type SiteHeaderViewProps = ReturnType<typeof useSiteHeaderState>;

export const SiteHeaderView = ({ close, followSection, open, openMenu }: SiteHeaderViewProps) => {
  const links = [`how`, `can`, `tasks`, `who`, `compare`] as const;

  return (
    <header className={styles.root}>
      <SiteHeaderNav followSection={followSection} links={links} />
      <div className={styles.actions}>
        <span className={styles.system}>
          <SystemButtons />
        </span>
        <Button link={{ href: `/app` }} tag={AppTags.site.cta.start} text={t(`nav.cta`)} type="primary" />
        <SiteHeaderMenu close={close} followSection={followSection} links={links} open={open} openMenu={openMenu} />
      </div>
    </header>
  );
};
