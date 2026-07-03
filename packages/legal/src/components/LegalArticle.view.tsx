import { Html } from "@snappy/browser";
import { _ } from "@snappy/core";

import type { useLegalArticleState } from "./LegalArticle.state";

import styles from "./LegalArticle.module.scss";

export type LegalArticleViewProps = ReturnType<typeof useLegalArticleState>;

export const LegalArticleView = ({ body, cn, onClick }: LegalArticleViewProps) => (
  <article className={_.cn(styles.root, cn)} onClick={onClick} {...Html.text(body)} />
);
