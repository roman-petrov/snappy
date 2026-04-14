import { TreeSitterFixedChunk } from "./TreeSitterFixedChunk";

export const TypeScriptChunk = TreeSitterFixedChunk<`.ts` | `.tsx`>([
  `arrow_function`,
  `class_declaration`,
  `enum_declaration`,
  `function_declaration`,
  `function`,
  `generator_function_declaration`,
  `interface_declaration`,
  `method_definition`,
  `module`,
  `type_alias_declaration`,
]);
