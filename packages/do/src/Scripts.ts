import path from "node:path";

const rootDir = () => {
  const fromEnv = process.env[`MCP_SERVER_ROOT`];

  return fromEnv !== undefined && fromEnv !== `` ? fromEnv : path.resolve(import.meta.dirname, `..`, `..`, `..`);
};

export const Scripts = { rootDir };
