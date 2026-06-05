/* eslint-disable functional/no-expression-statements */
import { _ } from "./_";

const minLength = 8;
const strongMinLength = 12;

type Strength = `medium` | `strong` | `weak`;

const strength = (password: string): Strength => {
  const hasLetter = /[A-Za-z]/u.test(password);
  const hasDigit = /\d/u.test(password);
  const hasLower = /[a-z]/u.test(password);
  const hasUpper = /[A-Z]/u.test(password);
  const hasSpecial = /[^\da-z]/iu.test(password);
  const variety = [hasLetter, hasDigit, hasLower, hasUpper, hasSpecial].filter(Boolean).length;

  return password.length === 0
    ? `weak`
    : password.length >= strongMinLength && variety >= 4
      ? `strong`
      : password.length >= minLength && variety >= 2
        ? `medium`
        : `weak`;
};

const valid = (password: string) => {
  const level = strength(password);

  return level === `medium` || level === `strong`;
};

const chars = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;

const generate = () => {
  const random = new Uint8Array(strongMinLength);
  crypto.getRandomValues(random);
  const password = _.gen(strongMinLength, index => chars[(random[index] ?? 0) % chars.length]).join(``);
  if (strength(password) !== `strong`) {
    return generate();
  }

  return password;
};

export const Password = { generate, minLength, strength, valid };
