import { TypeScriptChunk } from "../factory/TypeScriptChunk";

export const TsxChunk = TypeScriptChunk({ additionalNodes: [`jsx_element`], extensions: [`.tsx`], language: `tsx` });
