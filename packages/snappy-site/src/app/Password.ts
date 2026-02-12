/** Min length and rules for password (aligned with server). */
export const PASSWORD_MIN_LENGTH = 8;

const hasLetter = (s: string) => /[A-Za-z]/u.test(s);
const hasDigit = (s: string) => /\d/u.test(s);

export const passwordRequirementChecks: { check: (s: string) => boolean }[] = [
  { check: s => s.length >= PASSWORD_MIN_LENGTH },
  { check: s => hasLetter(s) && hasDigit(s) },
];

export const passwordValid = (s: string): boolean => passwordRequirementChecks.every(({ check }) => check(s));

type Strength = `medium` | `strong` | `weak`;

export const passwordStrength = (s: string): Strength => {
  if (s.length === 0) {
    return `weak`;
  }
  const hasLower = /[a-z]/u.test(s);
  const hasUpper = /[A-Z]/u.test(s);
  const hasSpecial = /[^\da-z]/i.test(s);
  const variety = [hasLetter(s), hasDigit(s), hasLower, hasUpper, hasSpecial].filter(Boolean).length;
  if (s.length >= 12 && variety >= 4) {
    return `strong`;
  }
  if (s.length >= 8 && variety >= 2) {
    return `medium`;
  }

  return `weak`;
};

const chars = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;

export const generatePassword = (length = 12): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  let s = ``;
  for (let index = 0; index < length; index++) {
    s += chars[array[index]! % chars.length];
  }
  if (!hasLetter(s) || !hasDigit(s)) {
    return generatePassword(length);
  }

  return s;
};
