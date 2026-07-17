/* eslint-disable functional/no-expression-statements */
import net from "node:net";

// ? https://docs.robokassa.ru/ru/notifications-and-redirects
const allow = new net.BlockList();
allow.addAddress(`185.59.216.65`, `ipv4`);
allow.addAddress(`185.59.217.65`, `ipv4`);

const allowsIp = (ip: string) => {
  const mapped = ip.startsWith(`::ffff:`) ? ip.slice(`::ffff:`.length) : ip;

  return mapped.includes(`:`) ? allow.check(mapped, `ipv6`) : allow.check(mapped, `ipv4`);
};

export const RobokassaConfig = { allowsIp };
