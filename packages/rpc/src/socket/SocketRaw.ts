export type SocketRaw = {
  close: () => void;
  on: {
    (event: `close` | `error` | `open`, listener: () => void): void;
    (event: `message`, listener: (raw: ArrayBuffer | Buffer | Buffer[] | string, isBinary: boolean) => void): void;
  };
  send: (data: Buffer | string) => void;
};
