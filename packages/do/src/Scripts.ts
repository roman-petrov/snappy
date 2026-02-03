import path from "node:path";

const rootDir = (): string => {
  const fromEnv = process.env[`MCP_SERVER_ROOT`];

  if (fromEnv !== undefined && fromEnv !== ``) {
    return fromEnv;
  }

  return path.resolve(import.meta.dirname, `..`, `..`, `..`);
};

export const Scripts = { rootDir };
