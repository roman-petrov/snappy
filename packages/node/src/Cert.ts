import { _ } from "@snappy/core";
import selfsigned from "selfsigned";

const generate = async () => {
  const hosts = [`home.local`, `localhost`, `127.0.0.1`];

  const generated = await selfsigned.generate([{ name: `commonName`, value: hosts[0] }], {
    algorithm: `sha256`,
    extensions: [{ altNames: hosts.map(value => ({ type: 2 as const, value })), name: `subjectAltName` }],
    keySize: 2048,
    notAfterDate: new Date(_.now() + _.day * _.daysInYear),
  });

  return { cert: generated.cert, key: generated.private };
};

export const Cert = { generate };
