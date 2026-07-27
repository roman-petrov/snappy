import type { useChipState } from "./Chip.state";

import styles from "./Chip.module.scss";
import { Tap } from "./Tap";
import { Text } from "./Text";

export type ChipViewProps = ReturnType<typeof useChipState>;

export const ChipView = ({ interactive, left, right, rootCn, tapProps, text, textProps }: ChipViewProps) => {
  const content = (
    <>
      {left === undefined ? undefined : <span className={styles.affix}>{left}</span>}
      <Text {...textProps} cn={styles.label} text={text} typography="captionSm" />
      {right === undefined ? undefined : <span className={styles.affix}>{right}</span>}
    </>
  );

  if (interactive) {
    return (
      <Tap cn={rootCn} {...tapProps}>
        {content}
      </Tap>
    );
  }

  return <span className={rootCn}>{content}</span>;
};
