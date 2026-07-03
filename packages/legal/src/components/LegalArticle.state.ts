import { type MouseEventHandler, useCallback } from "react";

import type { LegalArticleProps } from "./LegalArticle";

import { Legal } from "../Legal";

export const useLegalArticleState = ({ cn, locale, onNavigate, pathPrefix = ``, variant }: LegalArticleProps) => {
  const onClick: MouseEventHandler<HTMLElement> = useCallback(
    event => {
      if (onNavigate === undefined) {
        return;
      }
      const anchor = event.target instanceof Element ? event.target.closest(`a`) : undefined;
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }
      const path = Legal.route(anchor.pathname, pathPrefix);
      if (path === undefined) {
        return;
      }
      event.preventDefault();

      void onNavigate(path);
    },
    [onNavigate, pathPrefix],
  );

  return { body: Legal.body(variant, locale), cn, onClick: onNavigate === undefined ? undefined : onClick };
};
