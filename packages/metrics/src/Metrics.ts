/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
import type { MetricsParameters, MetricsProvider } from "./Types";

export const Metrics = (providers: readonly MetricsProvider[]) => {
  const dispatch = (method: keyof MetricsProvider) => (first: string, parameters?: MetricsParameters) => {
    for (const provider of providers) {
      provider[method](first, parameters);
    }
  };

  return { event: dispatch(`event`), page: dispatch(`page`) };
};

export type Metrics = ReturnType<typeof Metrics>;
