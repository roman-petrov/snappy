const pattern = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/u;

const valid = (email: string) => {
  const trimmed = email.trim();

  return trimmed.length > 0 && pattern.test(trimmed);
};

export type Email = { body?: string; subject?: string };

const mailto = (email: string, { body, subject }: Email = {}) => {
  const href = `mailto:${email.trim()}`;

  const parts = [
    subject === undefined ? undefined : `subject=${encodeURIComponent(subject)}`,
    body === undefined ? undefined : `body=${encodeURIComponent(body)}`,
  ].filter(part => part !== undefined);

  return parts.length === 0 ? href : `${href}?${parts.join(`&`)}`;
};

export const Email = { mailto, valid };
