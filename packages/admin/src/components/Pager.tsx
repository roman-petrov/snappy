import { Button, Text } from "@snappy/ui";

import styles from "./Pager.module.scss";

export type PagerProps = {
  nextDisabled?: boolean;
  nextText: string;
  onNext: () => void;
  onPrev: () => void;
  pageText: string;
  prevDisabled?: boolean;
  prevText: string;
};

export const Pager = ({
  nextDisabled = false,
  nextText,
  onNext,
  onPrev,
  pageText,
  prevDisabled: previousDisabled = false,
  prevText,
}: PagerProps) => (
  <div className={styles.root}>
    <Button disabled={previousDisabled} onClick={onPrev} text={prevText} />
    <Text text={pageText} typography="caption" />
    <Button disabled={nextDisabled} onClick={onNext} text={nextText} />
  </div>
);
