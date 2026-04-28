import { JavaScriptChunk } from "../factory/JavaScriptChunk";

export const JsChunk = JavaScriptChunk({
  additionalNodes: [`lexical_declaration`],
  extensions: [`.js`],
  language: `javascript`,
});
