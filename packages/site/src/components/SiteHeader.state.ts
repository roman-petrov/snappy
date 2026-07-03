import { Dom } from "@snappy/browser";
import { type MouseEventHandler, useCallback, useEffect, useState } from "react";

export const useSiteHeaderState = () => {
  const [open, setOpen] = useState(false);
  const openMenu = () => setOpen(true);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = `hidden`;

    const unsubscribe = Dom.subscribe(window, `keydown`, event => {
      if (event.key === `Escape`) {
        setOpen(false);
      }
    });

    return () => {
      body.style.overflow = previousOverflow;
      unsubscribe();
    };
  }, [open]);

  const followSection: MouseEventHandler<HTMLElement> = useCallback(
    event => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const href = event.target.closest(`a[href^="#"], a[href^="/#"]`)?.getAttribute(`href`) ?? ``;
      const hash = href.startsWith(`/#`) ? href.slice(1) : href;
      if (hash.length === 0) {
        return;
      }

      const section = document.querySelector(hash);
      if (!(section instanceof Element)) {
        document.body.style.overflow = ``;
        close();

        return;
      }

      event.preventDefault();
      document.body.style.overflow = ``;
      close();
      section.scrollIntoView({ behavior: `smooth` });
      window.history.replaceState(undefined, ``, hash);
    },
    [close],
  );

  return { close, followSection, open, openMenu };
};
