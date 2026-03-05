import type { FocusEvent } from "react";

export const useScrollFieldOnFocus = () => {
  const onFocus = (event: FocusEvent<HTMLElement>) => {
    const element = event.currentTarget;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => element.scrollIntoView({ behavior: `smooth`, block: `center` }));
    });
  };

  return onFocus;
};
