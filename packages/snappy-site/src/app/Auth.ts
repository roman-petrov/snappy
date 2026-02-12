const key = `snappy_token`;

export const getToken = (): string | undefined => {
  try {
    return sessionStorage.getItem(key) ?? undefined;
  } catch {
    return undefined;
  }
};

export const setToken = (token: string) => {
  try {
    sessionStorage.setItem(key, token);
  } catch {
    //
  }
};

export const clearToken = () => {
  try {
    sessionStorage.removeItem(key);
  } catch {
    //
  }
};
