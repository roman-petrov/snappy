import { Link } from "@snappy/ui";

import type { useSiteHeaderState } from "./SiteHeader.state";

import { Header } from "../../shared/Header";
import { LocaleSwitcher } from "../../shared/LocaleSwitcher";
import { SiteLocale, t } from "../core";

export type SiteHeaderViewProps = ReturnType<typeof useSiteHeaderState>;

export const SiteHeaderView = ({ logoOnClick, navItems }: SiteHeaderViewProps) => (
  <Header logoHref="/" logoOnClick={logoOnClick} logoTitle={t(`themeToggle`)}>
    {navItems.map(({ href, key }) => (
      <Link href={href} key={key} muted text={t(key)} />
    ))}
    <LocaleSwitcher getLocale={SiteLocale.getSiteLocale} setLocale={SiteLocale.setSiteLocale} t={SiteLocale.t} />
  </Header>
);
