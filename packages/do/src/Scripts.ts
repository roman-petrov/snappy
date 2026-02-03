const rootDir = (): string => {
  const fromEnv = process.env["MCP_SERVER_ROOT"];
  if (fromEnv !== undefined && fromEnv !== "") {
    return fromEnv;
  }
  return process.cwd();
};

export const Scripts = { rootDir };
