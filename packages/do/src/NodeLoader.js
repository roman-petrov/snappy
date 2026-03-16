/* eslint-disable functional/no-expression-statements */
/* eslint-disable func-style */
import { register } from "node:module";

const stubbedExtensions = [`.scss`, `.css`, `.svg`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.ico`, `.glsl`];

export function load(url, context, nextLoad) {
  const pathname = url.startsWith(`file:`) ? new URL(url).pathname : url;
  const isStubbed = stubbedExtensions.some(ext => pathname.endsWith(ext));

  if (isStubbed) {
    const isCssModule = pathname.endsWith(`.scss`) || pathname.endsWith(`.css`);
    const source = isCssModule ? `export default {}` : `export default ""`;

    return { format: `module`, shortCircuit: true, source };
  }

  return nextLoad(url, context);
}

await register(import.meta.url, import.meta.url);
