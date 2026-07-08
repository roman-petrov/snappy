/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable init-declarations */
import type { RouterRuntime } from "@snappy/router";

import { Dom } from "@snappy/browser";
import { _, type Action, type ReadonlyStore } from "@snappy/core";
import { Metrics, type MetricsParameters, type MetricsProvider } from "@snappy/metrics";
import { CookieConsent } from "@snappy/ui-core";

const tagSelector = `[tag]:not([disabled]):not([data-disabled="true"])`;
let providers: readonly MetricsProvider[] | undefined;
let hub: Metrics | undefined;
let signedInStore: ReadonlyStore<boolean> | undefined;
const allowed = () => CookieConsent.given() || (signedInStore?.() ?? false);

const activeHub = (): Metrics | undefined =>
  providers === undefined || !allowed() ? undefined : (hub ??= Metrics(providers));

const dispatch = (
  value: MetricsParameters | undefined,
  run: (metrics: Metrics, parameters: MetricsParameters) => void,
) => {
  const active = activeHub();

  if (active !== undefined) {
    run(active, { signed_in: signedInStore?.() ?? false, ...value });
  }
};

const send = (name: string, value?: MetricsParameters) =>
  dispatch(value, (metrics, parameters) => metrics.event(name, parameters));

const init = (input: readonly MetricsProvider[], runtime: RouterRuntime, signedIn?: ReadonlyStore<boolean>): Action => {
  providers = input;
  signedInStore = signedIn;
  hub = undefined;
  activeHub();

  const { $context, $page } = runtime.current();

  const sync = () => {
    const route = $page();
    const { href, path, query } = $context();
    const pagePath = query.size === 0 ? href(path) : `${href(path)}?${query}`;

    dispatch(route === undefined ? undefined : route.params, (metrics, parameters) =>
      metrics.page(pagePath, parameters),
    );
  };

  sync();

  return _.singleAction([
    Dom.subscribe(
      document,
      `click`,
      ({ target }) => {
        const name = target instanceof Element ? target.closest(tagSelector)?.getAttribute(`tag`) : undefined;

        if (!_.isString(name) || name === ``) {
          return;
        }

        send(name);
      },
      { capture: true },
    ),
    $context.subscribe(sync),
    $page.subscribe(sync),
  ]);
};

export const MetricsTracker = { init, send };
