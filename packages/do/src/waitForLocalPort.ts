import net from "node:net";

export const waitForLocalPort = async (port: number, timeoutMs = 60_000) =>
  new Promise<void>((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;

    const tryOnce = () => {
      const socket = net.createConnection({ host: `127.0.0.1`, port }, () => {
        socket.destroy();
        resolve();
      });
      socket.on(`error`, () => {
        socket.destroy();
        if (Date.now() >= deadline) {
          reject(new Error(`Timeout waiting for 127.0.0.1:${String(port)}`));
        } else {
          setTimeout(tryOnce, 100);
        }
      });
    };
    tryOnce();
  });
