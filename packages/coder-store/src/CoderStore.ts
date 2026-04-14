import { type CoderIgnore, Workspace } from "./core";
import {
  DeleteFileTool,
  GlobTool,
  GrepReplaceTool,
  GrepTool,
  ListDirectoryTool,
  MoveFileTool,
  ReadFileTool,
  RenameFileTool,
  WriteFileTool,
} from "./tools";

export type CoderStoreConfig = { ignore: CoderIgnore; projectRoot: string };

export const CoderStore = ({ ignore, projectRoot }: CoderStoreConfig) => {
  const workspace = Workspace({ ignore, projectRoot });

  const tools = {
    "coder-store": {
      "delete-file": DeleteFileTool(workspace),
      "glob": GlobTool(workspace),
      "grep": GrepTool(workspace),
      "grep-replace": GrepReplaceTool(workspace),
      "list-directory": ListDirectoryTool(workspace),
      "move-file": MoveFileTool(workspace),
      "read-file": ReadFileTool(workspace),
      "rename-file": RenameFileTool(workspace),
      "write-file": WriteFileTool(workspace),
    },
  } as const;

  return { tools };
};
