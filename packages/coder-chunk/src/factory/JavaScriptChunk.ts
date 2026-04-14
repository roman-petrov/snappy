import { TreeSitterFixedChunk } from "./TreeSitterFixedChunk";

export const JavaScriptChunk = TreeSitterFixedChunk<`.js` | `.jsx`>([
  `arrow_function`,
  `class_declaration`,
  `function_declaration`,
  `function`,
  `generator_function_declaration`,
  `method_definition`,
]);
