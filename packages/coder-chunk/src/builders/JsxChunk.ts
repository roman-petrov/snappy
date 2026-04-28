import { JavaScriptChunk } from "../factory/JavaScriptChunk";

export const JsxChunk = JavaScriptChunk({
  additionalNodes: [`jsx_element`],
  extensions: [`.jsx`],
  language: `javascript`,
});
