import { _ } from "@snappy/core";
import selfsigned from "selfsigned";

const generate = async (host: string) => {
  const years = 10;
  const notAfterDate = new Date(_.now() + _.day * _.daysInYear * years);

  const ca = await selfsigned.generate([{ name: `commonName`, value: `Snappy Dev CA` }], {
    algorithm: `sha256`,
    extensions: [{ cA: true, name: `basicConstraints` }],
    keySize: 2048,
    notAfterDate,
  });

  const leaf = await selfsigned.generate([{ name: `commonName`, value: host }], {
    algorithm: `sha256`,
    ca: { cert: ca.cert, key: ca.private },
    extensions: [{ altNames: [{ type: 2 as const, value: host }], name: `subjectAltName` }],
    keySize: 2048,
    notAfterDate,
  });

  return { ca: { cert: ca.cert, key: ca.private }, cert: leaf.cert, key: leaf.private };
};

export const Cert = { generate };
