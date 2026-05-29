import { _ } from "@snappy/core";
import selfsigned from "selfsigned";

const generate = async (host: string) => {
  const generated = await selfsigned.generate([{ name: `commonName`, value: host }], {
    algorithm: `sha256`,
    extensions: [{ altNames: [{ type: 2 as const, value: host }], name: `subjectAltName` }],
    keySize: 2048,
    notAfterDate: new Date(_.now() + _.day * _.daysInYear),
  });

  return { cert: generated.cert, key: generated.private };
};

export const Cert = { generate };
