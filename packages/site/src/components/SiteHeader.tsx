import { Link, SystemButtons } from "@snappy/ui";

import { t } from "../locales";
import styles from "./SiteHeader.module.scss";

export const SiteHeader = () => (
  <>
    <nav className={styles.nav}>
      <Link link="#features" muted text={t(`nav.features`)} />
      <Link link="#examples" muted text={t(`nav.examples`)} />
      <Link link="#who" muted text={t(`nav.who`)} />
      <Link link="#faq" muted text={t(`nav.faq`)} />
      <Link link="#start" muted text={t(`nav.start`)} />
      <Link link={{ href: `/app` }} muted text={t(`nav.cabinet`)} />
    </nav>
    <SystemButtons />
  </>
);
