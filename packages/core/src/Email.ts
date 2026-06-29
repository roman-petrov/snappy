const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

const valid = (email: string) => {
  const trimmed = email.trim();

  return trimmed.length > 0 && pattern.test(trimmed);
};

export const Email = { valid };
