import type { Action } from "@snappy/core";

export type DomSubscribe<TReturn = Action> = <
  TEvent extends Events[Types],
  TType extends keyof Pick<Events, { [K in Types]: Events[K] extends TEvent ? K : never }[Types]>,
>(
  element: Elements,
  type: TType,
  listener: (event: Events[TType]) => void,
  options?: AddEventListenerOptions | boolean,
) => TReturn;

type Elements = Document | Element | MediaQueryList | null | undefined | Window;

type Events = DocumentEventMap & HTMLElementEventMap & MediaQueryListEventMap & WindowEventMap;

type Types = keyof Events;
