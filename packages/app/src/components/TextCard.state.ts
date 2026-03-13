import type { TextCardProps } from "./TextCard";

import { t } from "../core";

export const useTextCardState = ({
  compact = false,
  loading,
  onTextChange,
  result,
  showResult,
  text,
}: TextCardProps) => {
  const wrapperVariant = compact ? `compact` : `full`;
  const cardSizeKey: `cardCompact` | `cardFull` = compact ? `cardCompact` : `cardFull`;
  const cardVariantKey: `cardInput` | `cardResult` = showResult ? `cardResult` : `cardInput`;
  const contentAreaKey: `contentArea` | `contentAreaScroll` = showResult ? `contentAreaScroll` : `contentArea`;
  const contentVariant = showResult ? `result` : `input`;
  const showOverlay = loading;

  return {
    cardSizeKey,
    cardVariantKey,
    contentAreaKey,
    contentVariant,
    loading,
    onTextChange,
    placeholder: t(`dashboard.textPlaceholder`),
    result,
    showOverlay,
    text,
    wrapperVariant,
  };
};
