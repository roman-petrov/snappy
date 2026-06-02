/* eslint-disable functional/no-expression-statements */
import type { StaticSetHeaders } from "@snappy/server-module";

import { _ } from "@snappy/core";

const hashedFile = (path: string) => /[-.]\w{8,}\./u.test(path.split(/[/\\]/u).at(-1) ?? ``);

const setHeaders: StaticSetHeaders = (response, path) => {
  if (hashedFile(path)) {
    response.setHeader(`Cache-Control`, `public, max-age=${_.day.seconds * _.daysInYear}, immutable`);
  }
};

export const Static = { setHeaders };
