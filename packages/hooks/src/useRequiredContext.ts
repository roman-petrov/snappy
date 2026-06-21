import { type Context, useContext } from "react";

export const useRequiredContext = <T>(context: Context<T | undefined>, name: string, provider: string): T => {
  const value = useContext(context);

  if (value === undefined) {
    throw new Error(`${name} requires ${provider}`);
  }

  return value;
};
