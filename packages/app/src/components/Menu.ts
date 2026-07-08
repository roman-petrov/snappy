import type { MenuAction } from "@snappy/ui";

import { Copy, Share2 } from "lucide-react";

import { AppTags } from "../AppTags";
import { t } from "../core";

type CopyShare = { copy: () => Promise<void> | void; share: () => Promise<void> | void };

const copyShare = ({ copy, share }: CopyShare): MenuAction[] => [
  { icon: Copy, key: `copy`, onClick: copy, tag: AppTags.feed.copy.click, tip: t(`feedCard.copy`) },
  { icon: Share2, key: `share`, onClick: share, tag: AppTags.feed.share.click, tip: t(`feedCard.share`) },
];

export const Menu = { copyShare };
