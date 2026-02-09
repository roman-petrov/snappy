import { Server } from "@snappy/server";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const configPath = join(homedir(), `snappy`, `config.json`);
if (!existsSync(configPath)) {
  throw new Error(`Config file not found at ${configPath}`);
}
const configRaw = readFileSync(configPath, `utf-8`);
const server = Server(configRaw, { serveSite: false });

server.start();
