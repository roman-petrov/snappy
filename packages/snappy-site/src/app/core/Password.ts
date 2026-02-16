/* eslint-disable functional/no-expression-statements */
const minLength = 8;
const hasLetter = (s: string) => /[A-Za-z]/u.test(s);
const hasDigit = (s: string) => /\d/u.test(s);

const requirementChecks: { check: (s: string) => boolean }[] = [
  { check: s => s.length >= minLength },
  { check: s => hasLetter(s) && hasDigit(s) },
];

const valid = (s: string) => requirementChecks.every(({ check }) => check(s));

type Strength = `medium` | `strong` | `weak`;

const strength = (s: string): Strength => {
  const strongMinLength = 12;
  const hasLower = /[a-z]/u.test(s);
  const hasUpper = /[A-Z]/u.test(s);
  const hasSpecial = /[^\da-z]/iu.test(s);
  const variety = [hasLetter(s), hasDigit(s), hasLower, hasUpper, hasSpecial].filter(Boolean).length;

  return s.length === 0
    ? `weak`
    : s.length >= strongMinLength && variety >= 4
      ? `strong`
      : s.length >= minLength && variety >= 2
        ? `medium`
        : `weak`;
};

const chars = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;
const defaultLength = 12;

const generate = (length = defaultLength) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  const s = Array.from(array, byte => chars[byte % chars.length]).join(``);
  if (!hasLetter(s) || !hasDigit(s)) {
    return generate(length);
  }

  return s;
};

export const Password = { generate, minLength, requirementChecks, strength, valid };
