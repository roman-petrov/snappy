import { Dom } from "@snappy/browser";
import { useEffect, useState } from "react";

export const useSiteHeaderState = () => {
  const [open, setOpen] = useState(false);
  const openMenu = () => setOpen(true);
  const close = () => setOpen(false);

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

  useEffect(
    () =>
      Dom.subscribe(document, `click`, event => {
        if (!(event.target instanceof Element)) {
          return;
        }

        const hash = event.target.closest(`a[href^="#"]`)?.getAttribute(`href`) ?? ``;
        if (hash.length === 0) {
          return;
        }

        const section = document.querySelector(hash);
        if (!(section instanceof Element)) {
          return;
        }

        event.preventDefault();
        section.scrollIntoView({ behavior: `smooth` });
        window.history.replaceState(undefined, ``, hash);
        setOpen(false);
      }),
    [],
  );

  return { close, open, openMenu };
};
