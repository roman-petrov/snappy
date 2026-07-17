/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
import type { PrismaClient } from "./generated/client";

export const DbCoreLive = <TData>() => {
  const listeners = new Set<(userId: string, data: TData) => void>();

  const emit = (userId: string, data: TData) => {
    for (const listener of listeners) {
      listener(userId, data);
    }
  };

  const live = (listener: (userId: string, data: TData) => void) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  };

  const user = <TApi>(create: (args: { emit: (data: TData) => void; prisma: PrismaClient; userId: string }) => TApi) =>
    Object.assign(
      (prisma: PrismaClient, userId: string) => create({ emit: data => emit(userId, data), prisma, userId }),
      { live },
    );

  const from = <TArgs extends unknown[], TApi>(
    userIdOf: (...args: TArgs) => string,
    create: (emit: (data: TData) => void, ...args: TArgs) => TApi,
  ) => Object.assign((...args: TArgs) => create(data => emit(userIdOf(...args), data), ...args), { live });

  return Object.assign(user, { from });
};
