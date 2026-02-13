/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-try-statements */
import jwt from "jsonwebtoken";

export type Payload = { userId: number };

const sign = (userId: number, secret: string, expiresIn = `7d`): string =>
  jwt.sign({ userId } as Payload, secret, { expiresIn } as jwt.SignOptions);

const verify = (token: string, secret: string): Payload | undefined => {
  try {
    const decoded = jwt.verify(token, secret) as Payload;

    return decoded;
  } catch {
    return undefined;
  }
};

export const Jwt = { sign, verify };
