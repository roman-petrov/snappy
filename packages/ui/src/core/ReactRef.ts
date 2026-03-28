/* eslint-disable no-continue */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
import type { Ref } from "react";

import { _ } from "@snappy/core";

const merge =
  <T>(...refs: (null | Ref<T> | undefined)[]) =>
  (node: null | T) => {
    for (const ref of refs) {
      if (ref === null || ref === undefined) {
        continue;
      }
      if (_.isFunction(ref)) {
        ref(node);
      } else {
        ref.current = node;
      }
    }
  };

export const ReactRef = { merge };
