/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-try-statements */
import { Prisma } from "./generated/client";

const ignoreUnique = async <T>(run: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await run();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === `P2002`) {
      return fallback;
    }
    throw error;
  }
};

export const DbCorePrisma = { ignoreUnique };
