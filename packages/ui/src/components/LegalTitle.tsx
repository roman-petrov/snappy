import type { LegalVariant } from "@snappy/legal";

import { t } from "../locales";
import { Text } from "./Text";

export type LegalTitleProps = { as?: `h1` | `span`; cn?: string; typography?: `h1` | `h3`; variant: LegalVariant };

export const LegalTitle = ({ as = `h1`, cn, typography = `h1`, variant }: LegalTitleProps) => (
  <Text as={as} cn={cn} text={t(`legal.${variant}.title`)} typography={typography} />
);
