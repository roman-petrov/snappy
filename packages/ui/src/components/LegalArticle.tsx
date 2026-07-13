import { Html } from "@snappy/browser";
import { _ } from "@snappy/core";
import { Legal, type LegalVariant } from "@snappy/legal";

import { Language } from "../core";
import styles from "./LegalArticle.module.scss";

export type LegalArticleProps = { cn?: string; variant: LegalVariant };

export const LegalArticle = ({ cn, variant }: LegalArticleProps) => (
  <article className={_.cn(styles.root, cn)} {...Html.text(Legal.body(variant, Language.locale()))} />
);
