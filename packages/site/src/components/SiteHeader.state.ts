import type { MouseEvent } from "react";

import { Theme } from "@snappy/ui";

export const useSiteHeaderState = () => {
  const logoOnClick = (event: MouseEvent) => {
    event.preventDefault();
    Theme.toggle();
  };

  const navItems = [
    { href: `#features`, key: `nav.features` },
    { href: `#examples`, key: `nav.examples` },
    { href: `#who`, key: `nav.who` },
    { href: `#faq`, key: `nav.faq` },
    { href: `#start`, key: `nav.start` },
    { href: `/app`, key: `nav.cabinet` },
  ];

  return { logoOnClick, navItems };
};
