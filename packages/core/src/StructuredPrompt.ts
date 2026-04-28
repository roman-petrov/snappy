/**
 * We use XML-like tags trying to follow the best practices for prompt engineering.
 * Cursor IDE does the same in its system prompt.
 * ? https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#structure-prompts-with-xml-tags
 * ? https://theneuralbase.com/prompt-engineering/qna/how-to-use-xml-tags-in-claude-prompts/
 */
export type StructuredPrompt = readonly StructuredPromptSection[];

export type StructuredPromptSection = readonly [tag: string, content: string];

type DuplicateTag<T extends StructuredPrompt, Seen extends string = never> = T extends readonly [
  infer Head extends StructuredPromptSection,
  ...infer Tail extends StructuredPrompt,
]
  ? Head[0] extends Seen
    ? Head[0]
    : DuplicateTag<Tail, Head[0] | Seen>
  : never;

type UniqueSections<T extends StructuredPrompt> =
  DuplicateTag<T> extends never ? T : { duplicateStructuredPromptSection: DuplicateTag<T> };

export const StructuredPrompt = <const T extends StructuredPrompt>(sections: T & UniqueSections<T>): string =>
  sections.map(([tag, content]) => `<${tag}>\n${content}\n</${tag}>`).join(`\n\n`);
