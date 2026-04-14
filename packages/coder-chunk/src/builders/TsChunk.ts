import typeScript from "tree-sitter-typescript";

import { TypeScriptChunk } from "../factory/TypeScriptChunk";
import { TreeSitter } from "../TreeSitter";

export const TsChunk = TypeScriptChunk({ extension: `.ts`, parser: TreeSitter.parser(`.ts`, typeScript.typescript) });
