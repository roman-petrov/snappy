/* eslint-disable @typescript-eslint/naming-convention */
import DOMPurify from "isomorphic-dompurify";

const sanitize = (html: string) => DOMPurify.sanitize(html);
const text = (html: string) => ({ dangerouslySetInnerHTML: { __html: sanitize(html) } });

export const Html = { sanitize, text };
