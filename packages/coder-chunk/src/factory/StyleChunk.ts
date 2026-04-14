import { TreeSitterFixedChunk } from "./TreeSitterFixedChunk";

export const StyleChunk = TreeSitterFixedChunk<`.css` | `.scss`>([`at_rule`, `rule_set`]);
