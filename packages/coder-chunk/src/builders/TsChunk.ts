import { TypeScriptChunk } from "../factory/TypeScriptChunk";

export const TsChunk = TypeScriptChunk({
  additionalNodes: [`lexical_declaration`],
  extensions: [`.ts`],
  language: `typescript`,
});
