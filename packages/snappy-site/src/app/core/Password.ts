/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/** Min length and rules for password (aligned with server). */
export const passwordMinLength = 8;

const hasLetter = (s: string) => /[A-Za-z]/u.test(s);
const hasDigit = (s: string) => /\d/u.test(s);

export const passwordRequirementChecks: { check: (s: string) => boolean }[] = [
  { check: s => s.length >= passwordMinLength },
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
  const hasSpecial = /[^\da-z]/iu.test(s);
  const variety = [hasLetter(s), hasDigit(s), hasLower, hasUpper, hasSpecial].filter(Boolean).length;
  const strongMinLength = 12;
  if (s.length >= strongMinLength && variety >= 4) {
    return `strong`;
  }
  if (s.length >= passwordMinLength && variety >= 2) {
    return `medium`;
  }
  return `weak`;
};

const chars = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;

const defaultPasswordLength = 12;

export const generatePassword = (length = defaultPasswordLength): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  let s = ``;
  for (let index = 0; index < length; index += 1) {
    const charIndex = array[index];
    s += chars[(charIndex ?? 0) % chars.length];
  }
  if (!hasLetter(s) || !hasDigit(s)) {
    return generatePassword(length);
  }

  return s;
};
