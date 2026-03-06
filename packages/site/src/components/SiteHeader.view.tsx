import { Header, Link, SystemButtons } from "@snappy/ui";

import type { useSiteHeaderState } from "./SiteHeader.state";

import { t } from "../core";

export type SiteHeaderViewProps = ReturnType<typeof useSiteHeaderState>;

export const SiteHeaderView = ({ navItems }: SiteHeaderViewProps) => (
  <Header>
    {navItems.map(({ href, key }) => (
      <Link href={href} key={key} muted text={t(key)} />
    ))}
    <SystemButtons />
  </Header>
);
