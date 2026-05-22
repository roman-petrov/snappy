import type { MenuAction } from "@snappy/ui";

import { t } from "../../locales";

type CopyShare = { copy: () => Promise<void> | void; share: () => Promise<void> | void };

const copyShare = ({ copy, share }: CopyShare): MenuAction[] => [
  { icon: `content_copy`, key: `copy`, onClick: copy, tip: t(`feedCard.copy`) },
  { icon: `share`, key: `share`, onClick: share, tip: t(`feedCard.share`) },
];

export const Menu = { copyShare };
