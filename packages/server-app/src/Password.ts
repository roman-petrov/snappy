import bcrypt from "bcryptjs";

const saltRounds = 10;
const hash = async (password: string) => bcrypt.hash(password, saltRounds);
const verify = async (password: string, hashValue: string) => bcrypt.compare(password, hashValue);

export const Password = { hash, verify };
