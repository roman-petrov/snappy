// cspell:word googlemail protonmail ymail
const pattern = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/u;

const foreignDomains = new Set([
  `aol.com`,
  `gmail.com`,
  `googlemail.com`,
  `hotmail.com`,
  `icloud.com`,
  `live.com`,
  `mac.com`,
  `mail.com`,
  `me.com`,
  `msn.com`,
  `outlook.com`,
  `proton.me`,
  `protonmail.com`,
  `yahoo.com`,
  `ymail.com`,
]);

const domain = (email: string) => {
  const normalized = email.trim().toLowerCase();
  const at = normalized.lastIndexOf(`@`);

  return at === -1 ? `` : normalized.slice(at + 1);
};

const valid = (email: string) => {
  const trimmed = email.trim();

  return trimmed.length > 0 && pattern.test(trimmed);
};

const foreignProvider = (email: string) => {
  const host = domain(email);

  return host.length > 0 && foreignDomains.has(host);
};

const mailto = (email: string) => `mailto:${email.trim()}`;

export const Email = { foreignProvider, mailto, valid };
