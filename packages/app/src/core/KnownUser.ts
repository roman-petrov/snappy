/* eslint-disable functional/no-expression-statements */
const key = `known-user`;

const mark = () => {
  if (typeof localStorage === `undefined`) {
    return;
  }
  localStorage.setItem(key, ``);
};

const marked = () => typeof localStorage !== `undefined` && localStorage.getItem(key) !== null;

export const KnownUser = { mark, marked };
