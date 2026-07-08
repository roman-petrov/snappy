export type MetricsParameters = Record<string, boolean | number | string>;

export type MetricsProvider = {
  event: (name: string, parameters?: MetricsParameters) => void;
  page: (path: string, parameters?: MetricsParameters) => void;
};
