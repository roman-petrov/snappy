export const useSiteHeaderState = () => {
  const navItems = [
    { href: `#features`, key: `nav.features` },
    { href: `#examples`, key: `nav.examples` },
    { href: `#who`, key: `nav.who` },
    { href: `#faq`, key: `nav.faq` },
    { href: `#start`, key: `nav.start` },
    { href: `/app`, key: `nav.cabinet` },
  ];

  return { navItems };
};
