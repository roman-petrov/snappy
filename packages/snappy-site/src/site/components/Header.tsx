import { Header } from "../../shared/Header";
import { LocaleSwitcher } from "../../shared/LocaleSwitcher";
import { MutedLink } from "../../shared/MutedLink";
import { Theme } from "../../core/Theme";
import { SiteLocale, t } from "../core/Locale";

export const SiteHeader = () => (
  <Header logoHref="/" logoOnClick={Theme.onLogoClick()} logoTitle={t(`themeToggle`)}>
    <MutedLink href="#features">{t(`nav.features`)}</MutedLink>
    <MutedLink href="#examples">{t(`nav.examples`)}</MutedLink>
    <MutedLink href="#who">{t(`nav.who`)}</MutedLink>
    <MutedLink href="#faq">{t(`nav.faq`)}</MutedLink>
    <MutedLink href="#start">{t(`nav.start`)}</MutedLink>
    <MutedLink href="/app">{t(`nav.cabinet`)}</MutedLink>
    <LocaleSwitcher getLocale={SiteLocale.getSiteLocale} setLocale={SiteLocale.setSiteLocale} t={SiteLocale.t} />
  </Header>
);
