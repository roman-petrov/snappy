/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
const key = `snappy_token`;

export const getToken = (): string | undefined => {
  try {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key) ?? undefined;
  } catch {
    return undefined;
  }
};

export const setToken = (token: string, remember = false): void => {
  try {
    if (remember) {
      localStorage.setItem(key, token);
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, token);
      localStorage.removeItem(key);
    }
  } catch {
    //
  }
};

export const clearToken = (): void => {
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  } catch {
    //
  }
};
