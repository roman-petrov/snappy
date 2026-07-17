/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
import type { SocketRaw } from "../socket";

import { Protocol } from "../Protocol";

export const Hub = () => {
  const sockets = new Map<string, Set<SocketRaw>>();
  const sequences = new Map<string, number>();

  const add = (userId: string, socket: SocketRaw) => {
    const userSockets = sockets.get(userId) ?? new Set<SocketRaw>();
    userSockets.add(socket);
    sockets.set(userId, userSockets);
  };

  const remove = (userId: string, socket: SocketRaw) => {
    const userSockets = sockets.get(userId);
    if (userSockets === undefined) {
      return;
    }
    userSockets.delete(socket);
    if (userSockets.size === 0) {
      sockets.delete(userId);
    }
  };

  const push = (userId: string, path: string, data: unknown) => {
    const seqKey = `${userId}\0${path}`;
    const seq = (sequences.get(seqKey) ?? 0) + 1;
    sequences.set(seqKey, seq);
    const userSockets = sockets.get(userId);
    if (userSockets === undefined) {
      return;
    }
    const message = Protocol.stringify({ data, path, seq, type: `event` });
    for (const socket of userSockets) {
      socket.send(message);
    }
  };

  return { add, push, remove };
};

export type Hub = ReturnType<typeof Hub>;
