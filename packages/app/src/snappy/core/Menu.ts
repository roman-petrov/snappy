import type { MenuAction } from "@snappy/ui";

import { Copy, Share2 } from "lucide-react";

import { t } from "../../locales";

type CopyShare = { copy: () => Promise<void> | void; share: () => Promise<void> | void };

const copyShare = ({ copy, share }: CopyShare): MenuAction[] => [
  { icon: Copy, key: `copy`, onClick: copy, tip: t(`feedCard.copy`) },
  { icon: Share2, key: `share`, onClick: share, tip: t(`feedCard.share`) },
];

export const Menu = { copyShare };
