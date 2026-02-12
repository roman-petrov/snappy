import jwt from "jsonwebtoken";

export type Payload = { userId: number };

const defaultExpiresIn = `7d`;

const sign = (userId: number, secret: string, expiresIn: string = defaultExpiresIn): string =>
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
