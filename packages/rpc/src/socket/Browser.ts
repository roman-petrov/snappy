/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-expression-statements */
import { _ } from "@snappy/core";

import type { SocketRaw } from "./SocketRaw";

const wrap = (socket: WebSocket): SocketRaw => {
  const close = () => socket.close();

  const on: SocketRaw[`on`] = (event, listener) => {
    if (event === `message`) {
      socket.addEventListener(`message`, messageEvent => {
        const { data } = messageEvent;
        const isBinary = !_.isString(data);
        listener(data as ArrayBuffer | string, isBinary);
      });

      return;
    }
    if (event === `open`) {
      socket.addEventListener(`open`, listener as () => void);

      return;
    }
    if (event === `close`) {
      socket.addEventListener(`close`, listener as () => void);

      return;
    }
    socket.addEventListener(`error`, listener as () => void);
  };

  const send = (data: Buffer | string) => {
    socket.send(_.isString(data) ? data : new Uint8Array(data));
  };

  return { close, on, send };
};

export const Browser = { wrap };
