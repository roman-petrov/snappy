import css from "tree-sitter-css";

import { StyleChunk } from "../factory/StyleChunk";
import { TreeSitter } from "../TreeSitter";

export const CssChunk = StyleChunk({ extension: `.css`, parser: TreeSitter.parser(`.css`, css) });
