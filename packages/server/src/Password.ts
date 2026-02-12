import bcrypt from "bcryptjs";

const saltRounds = 10;
const hash = async (password: string): Promise<string> => bcrypt.hash(password, saltRounds);

const verify = async (password: string, hashValue: string): Promise<boolean> => bcrypt.compare(password, hashValue);

export const Password = { hash, verify };
