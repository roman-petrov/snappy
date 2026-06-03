import { Button, Text } from "@snappy/ui";

import type { usePagerState } from "./Pager.state";

import { t } from "../core";
import styles from "./Pager.module.scss";

export type PagerViewProps = ReturnType<typeof usePagerState>;

export const PagerView = ({ next, nextDisabled, page, pageCount, previous, previousDisabled }: PagerViewProps) => (
  <div className={styles.root}>
    <Button disabled={previousDisabled} onClick={previous} text={t(`pager.prev`)} />
    <Text text={t(`pager.page`, { page, pageCount })} typography="caption" />
    <Button disabled={nextDisabled} onClick={next} text={t(`pager.next`)} />
  </div>
);
