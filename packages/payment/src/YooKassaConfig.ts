/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable functional/no-expression-statements */
import net from "node:net";

// ? https://yookassa.ru/developers/using-api/webhooks#ip
const allow = new net.BlockList();
allow.addSubnet(`185.71.76.0`, 27, `ipv4`);
allow.addSubnet(`185.71.77.0`, 27, `ipv4`);
allow.addSubnet(`77.75.153.0`, 25, `ipv4`);
allow.addSubnet(`77.75.154.128`, 25, `ipv4`);
allow.addAddress(`77.75.156.11`, `ipv4`);
allow.addAddress(`77.75.156.35`, `ipv4`);
allow.addSubnet(`2a02:5180::`, 32, `ipv6`);

const allowsIp = (ip: string) => {
  const mapped = ip.startsWith(`::ffff:`) ? ip.slice(`::ffff:`.length) : ip;

  return mapped.includes(`:`) ? allow.check(mapped, `ipv6`) : allow.check(mapped, `ipv4`);
};

export const YooKassaConfig = { allowsIp };
