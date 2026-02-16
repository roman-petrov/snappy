import { Link, Theme } from "@snappy/ui";

import { Header } from "../../shared/Header";
import { LocaleSwitcher } from "../../shared/LocaleSwitcher";
import { SiteLocale, t } from "../core";

export const SiteHeader = () => (
  <Header logoHref="/" logoOnClick={Theme.onLogoClick()} logoTitle={t(`themeToggle`)}>
    <Link href="#features" muted>
      {t(`nav.features`)}
    </Link>
    <Link href="#examples" muted>
      {t(`nav.examples`)}
    </Link>
    <Link href="#who" muted>
      {t(`nav.who`)}
    </Link>
    <Link href="#faq" muted>
      {t(`nav.faq`)}
    </Link>
    <Link href="#start" muted>
      {t(`nav.start`)}
    </Link>
    <Link href="/app" muted>
      {t(`nav.cabinet`)}
    </Link>
    <LocaleSwitcher getLocale={SiteLocale.getSiteLocale} setLocale={SiteLocale.setSiteLocale} t={SiteLocale.t} />
  </Header>
);
