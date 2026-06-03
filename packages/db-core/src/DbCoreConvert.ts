import type { Prisma } from "./generated/client";

const amount = (value: null | Prisma.Decimal | undefined) =>
  value === null || value === undefined ? 0 : Number(value);

const optional = <T>(value: null | T | undefined): T | undefined => (value === null ? undefined : value);
const time = (value: Date) => value.getTime();

export const DbCoreConvert = { amount, optional, time };
