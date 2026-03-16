export const useSiteHeaderState = () => {
  const navItems = [
    { key: `nav.features`, link: `#features` },
    { key: `nav.examples`, link: `#examples` },
    { key: `nav.who`, link: `#who` },
    { key: `nav.faq`, link: `#faq` },
    { key: `nav.start`, link: `#start` },
    { key: `nav.cabinet`, link: { href: `/app` } },
  ];

  return { navItems };
};
