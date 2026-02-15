/* eslint-disable @typescript-eslint/naming-convention */
import DOMPurify from "dompurify";

const text = (html: string) => ({ dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(html) } });

export const Html = { text };
