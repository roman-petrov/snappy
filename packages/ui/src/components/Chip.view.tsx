import type { useChipState } from "./Chip.state";

import styles from "./Chip.module.scss";
import { Tap } from "./Tap";
import { Text } from "./Text";

export type ChipViewProps = ReturnType<typeof useChipState>;

export const ChipView = ({ interactive, left, rootCn, tapProps, text, textProps }: ChipViewProps) => {
  const content = (
    <>
      {left === undefined ? undefined : <span className={styles.left}>{left}</span>}
      <Text {...textProps} as="span" text={text} typography="captionSm" />
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
