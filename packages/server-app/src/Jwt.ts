/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-try-statements */
import jwt from "jsonwebtoken";

const sign = (userId: number, secret: string, expiresIn = `7d`) =>
  jwt.sign({ userId }, secret, { expiresIn } as jwt.SignOptions);

const verify = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as { userId: number };

    return decoded;
  } catch {
    return undefined;
  }
};

export const Jwt = { sign, verify };
